// brian taylor vann
// chunk

import type {
  ChunkBase,
  BangerBase,
  ChunkEffect,
} from "../type_flyweight/chunk.ts";
import type { Chunker } from "../type_flyweight/chunker.ts";
import type { Hooks } from "../type_flyweight/hooks.ts";
import type {
  ReferenceMap,
  RenderStructure,
} from "../type_flyweight/render.ts";
import type { Template } from "../type_flyweight/template.ts";

import { buildRenderStructure } from "../builders/builder.ts";

// Nodes
// Attributes
// Parameters
// State

// Also don't forget to take traditional naps

type HasTemplateChanged = (
  rs: RenderStructure<unknown, unknown>,
  template: Template<unknown, unknown>
) => boolean;

type UpdateAttributesFunc = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
  template: Template<N, A>
) => void;

interface UpdateDescendantsFuncParams<N, A> {
  hooks: Hooks<N, A>;
  rs: RenderStructure<N, A>;
  template: Template<N, A>;
  chunkLeftNode?: N;
  chunkParentNode?: N;
}

type UpdateDescendantsFunc = <N, A>(
  params: UpdateDescendantsFuncParams<N, A>
) => boolean;

type DisconnectDescendants = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>
) => void;

interface ContextParams<N, A, P, S> {
  hooks: Hooks<N, A>;
  chunker: Chunker<N, A, P, S>;
  params: P;
}

type GetUpdatedSiblings = <N, A>(rs: RenderStructure<N, A>) => N[];

class Banger<N> implements BangerBase<N> {
  chunk: ChunkBase<N>;

  constructor(chunk: ChunkBase<N>) {
    this.chunk = chunk;
  }

  bang() {
    this.chunk.bang();
  }

  getReferences() {
    return this.chunk.getReferences();
  }
}

class Chunk<N, A, P, S> implements ChunkBase<N> {
  // EXTERNAL EFFECTS
  parentNode?: N;
  leftNode?: N;
  siblings: N[];
  effect: ChunkEffect;

  // INIT PARAMS
  private hooks: Hooks<N, A>;
  private chunker: Chunker<N, A, P, S>;

  // REQUIRED EFFECTS
  private banger: Banger<N>;
  private rs: RenderStructure<N, A>;

  // GENERATED EFFECTS
  private params: P;
  private state: S;

  // INIT

  constructor(baseParams: ContextParams<N, A, P, S>) {
    // REQUIRED EFFECTS
    this.banger = new Banger(this);
    this.hooks = baseParams.hooks;
    this.chunker = baseParams.chunker;
    this.params = baseParams.params;

    // GENERATED EFFECTS
    this.state = this.chunker.connect({
      banger: this.banger,
      params: baseParams.params,
    });

    const template = this.getTemplate();
    this.rs = buildRenderStructure(this.hooks, template);
    this.siblings = getUpdatedSiblings(this.rs);
    this.effect = this.updateEffect(true, false);
  }

  bang() {
    this.update(this.params);
  }

  // LIFECYCLE API
  //
  connect(params: P): S {
    this.setParams(params);
    const template = this.getTemplate();
    this.state = this.chunker.connect({
      banger: this.banger,
      params,
    });

    this.rs = buildRenderStructure(this.hooks, template);
    this.siblings = getUpdatedSiblings(this.rs);
    this.updateEffect(true, false);

    return this.state;
  }

  update(params: P): void {
    this.setParams(params);
    if (!this.effect.connected) {
      this.connect(this.params);
      return;
    }

    const template = this.getTemplate();
    if (hasTemplateChanged(this.rs, template)) {
      this.disconnect();
      this.connect(params);
      return;
    }

    updateAttributes(this.hooks, this.rs, template);
    const descendantsUpdated = updateDescendants({
      chunkParentNode: this.parentNode,
      hooks: this.hooks,
      rs: this.rs,
      template,
    });

    if (descendantsUpdated) {
      this.siblings = getUpdatedSiblings(this.rs);
    }
  }

  mount(parentNode?: N, leftNode?: N): N | undefined {
    // set parent and left nodes for context
    this.parentNode = parentNode;
    this.leftNode = leftNode;

    // attach siblings to parent
    let prevSibling;
    let descendant = leftNode;
    for (const siblingID in this.siblings) {
      prevSibling = descendant;
      descendant = this.siblings[siblingID];

      this.hooks.insertDescendant({
        leftNode: prevSibling,
        parentNode,
        descendant,
      });
    }

    this.updateEffect(this.effect.connected, true);

    return descendant;
  }

  unmount(): void {
    for (const siblingID in this.siblings) {
      const sibling = this.siblings[siblingID];
      this.hooks.removeDescendant(sibling);
    }

    this.parentNode = undefined;
    this.leftNode = undefined;

    this.updateEffect(this.effect.connected, false);
  }

  disconnect(): void {
    disconnectDescendants(this.hooks, this.rs);
    if (this.state !== undefined) {
      this.chunker?.disconnect({ state: this.state });
    }

    this.updateEffect(false, this.effect.mounted);
  }

  // CONTEXT API
  //

  getSiblings(): N[] {
    return this.siblings;
  }

  getReferences(): ReferenceMap<N> | undefined {
    return this.rs.references;
  }

  getEffect(): ChunkEffect {
    return this.effect;
  }

  private setParams(params: P) {
    this.params = params;
  }

  private getTemplate(): Template<N, A> {
    return this.chunker.update({
      banger: this.banger,
      state: this.state,
      params: this.params,
    });
  }

  private updateEffect(connected: boolean, mounted: boolean): ChunkEffect {
    this.effect = {
      timestamp: performance.now(),
      connected,
      mounted,
    };
    return this.effect;
  }
}

const getUpdatedSiblings: GetUpdatedSiblings = (rs) => {
  const siblingsDelta = [];

  const siblings = rs.siblings;
  for (const siblingsID in siblings) {
    const siblingArray = siblings[siblingsID];
    for (const siblingID in siblingArray) {
      const sibling = siblingArray[siblingID];
      siblingsDelta.push(sibling);
    }
  }

  return siblingsDelta;
};

const hasTemplateChanged: HasTemplateChanged = (rs, template) => {
  const templateLength = template.templateArray.length;
  if (rs.template.templateArray.length !== templateLength) {
    return true;
  }

  let index = 0;
  while (index < templateLength) {
    const sourceStr = rs.template.templateArray[index];
    const targetStr = template.templateArray[index];
    if (sourceStr !== targetStr) {
      return true;
    }

    index += 1;
  }

  return false;
};

// compare future template to current template (past injection)
const updateAttributes: UpdateAttributesFunc = (hooks, rs, template) => {
  for (const attributesID in rs.attributes) {
    const pastInjection = rs.attributes[attributesID];
    const attributeValue = template.injections[attributesID];

    // check if attribute value has changed
    if (attributeValue === pastInjection.params.value) {
      continue;
    }

    // give yourself a chance to remove attribute
    pastInjection.params.value = attributeValue;
    hooks.setAttribute(pastInjection.params);
  }
};

const updateDescendants: UpdateDescendantsFunc = ({
  hooks,
  rs,
  template,
  chunkParentNode,
}) => {
  let siblingLevelUpdated = false;

  // we can split this up into "update text node" and "update chunks"

  // iterate through descendants
  for (const descenantID in rs.descendants) {
    const pastDescendant = rs.descendants[descenantID];
    const descendant = template.injections[descenantID];

    // both descendants are strings
    const text = String(descendant);
    if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
      if (pastDescendant.params.text === text) {
        continue;
      }
    }

    // both descendants are strings
    if (pastDescendant.kind === "TEXT" && Array.isArray(descendant)) {
      hooks.removeDescendant(pastDescendant.params.textNode);
    }

    // prev descendant is array, current is string
    if (pastDescendant.kind === "CHUNK_ARRAY" && !Array.isArray(descendant)) {
      const { chunkArray } = pastDescendant.params;
      for (const chunkID in chunkArray) {
        chunkArray[chunkID].unmount();
      }
    }

    // both descendants are arrays
    if (pastDescendant.kind === "CHUNK_ARRAY" && Array.isArray(descendant)) {
      // walk down new array and remove old chunks
      const { chunkArray } = pastDescendant.params;

      let index = chunkArray.length;
      let deltaIndex = descendant.length;
      let hasChanged = false;
      while (index > -1 && deltaIndex > -1) {
        if (chunkArray[index] === descendant[deltaIndex]) {
          index -= 1;
        } else {
          hasChanged = true;
          chunkArray[index].disconnect();
        }

        deltaIndex -= 1;
      }
      if (!hasChanged) {
        continue;
      }
    }

    // assign new chunks
    const { leftNode, parentNode, siblingIndex } = pastDescendant.params;
    const parentDefault = parentNode ?? chunkParentNode;
    if (!siblingLevelUpdated) {
      siblingLevelUpdated = siblingIndex !== undefined;
    }

    if (Array.isArray(descendant)) {
      rs.descendants[descenantID] = {
        kind: "CHUNK_ARRAY",
        params: {
          chunkArray: descendant,
          leftNode,
          parentNode,
          siblingIndex,
        },
      };

      let currLeftNode = leftNode;
      for (const chunkID in descendant) {
        const chunk = descendant[chunkID];
        if (!chunk.effect.mounted) {
          currLeftNode = chunk.mount(parentDefault, currLeftNode);
        } else {
          currLeftNode = chunk.leftNode;
        }
      }
    } else {
      const textNode = hooks.createTextNode(text);

      rs.descendants[descenantID] = {
        kind: "TEXT",
        params: {
          parentNode: parentDefault, // save original parent, important
          leftNode,
          siblingIndex,
          text,
          textNode,
        },
      };

      // add sibling to render structure to get mounted later
      if (siblingIndex !== undefined) {
        rs.siblings[siblingIndex] = [textNode];
      }

      hooks.insertDescendant({
        parentNode: parentDefault, // append actual parent
        descendant: textNode,
        leftNode,
      });
    }

    // disconnect all unmounted chunks
    if (pastDescendant.kind === "CHUNK_ARRAY") {
      const { chunkArray } = pastDescendant.params;
      for (const chunkID in chunkArray) {
        const chunk = chunkArray[chunkID];
        if (chunk.effect.mounted) {
          chunk.disconnect();
        }
      }
    }
  }

  // return if sibling level nodes were updated
  return siblingLevelUpdated;
};

const disconnectDescendants: DisconnectDescendants = (hooks, rs) => {
  const attributes = rs.attributes;
  for (const attributeID in attributes) {
    const attribute = attributes[attributeID];
    hooks.removeAttribute(attribute.params);
  }

  for (const descendantID in rs.descendants) {
    const descendant = rs.descendants[descendantID];
    if (descendant.kind === "TEXT") {
      hooks.removeDescendant(descendant.params.textNode);
    }
    if (descendant.kind === "CHUNK_ARRAY") {
      const chunkArray = descendant.params.chunkArray;
      for (const chunkID in chunkArray) {
        const chunk = chunkArray[chunkID];
        chunk.unmount();
        chunk.disconnect();
      }
    }
  }
};

export { Banger, Chunk };
