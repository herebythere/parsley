// brian taylor vann
// chunk

import type {
  ChunkBase,
  BangerBase,
  ChunkEffect,
  EffectQuality,
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

type HasTemplateChanged = <N, A>(
  rs: RenderStructure<N, A>,
  template: Template<N, A>
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
  contextLeftNode?: N;
  contextParentNode?: N;
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

// remove generics
class Banger<N, A, P, S> implements BangerBase<N> {
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

  // INIT PARAMS
  private hooks: Hooks<N, A>;
  private chunker: Chunker<N, A, P, S>;

  // REQUIRED EFFECTS
  private banger: Banger<N, A, P, S>;
  private rs: RenderStructure<N, A>;

  // GENERATED EFFECTS
  private params: P;
  private state: S;
  private effect: ChunkEffect;

  // INIT

  constructor(baseParams: ContextParams<N, A, P, S>) {
    // REQUIRED EFFECTS
    this.banger = new Banger(this);
    this.hooks = baseParams.hooks;
    this.chunker = baseParams.chunker;

    // GENERATED EFFECTS
    this.params = baseParams.params;
    this.state = this.chunker.connect({
      banger: this.banger,
      params: baseParams.params,
    });

    const template = this.getTemplate();

    this.rs = buildRenderStructure(this.hooks, template);
    this.siblings = getUpdatedSiblings(this.rs);
    this.effect = this.updateEffect("UNMOUNTED");
  }

  bang() {
    this.update(this.params);
  }

  // LIFECYCLE API
  //

  update(params: P): void {
    this.setParams(params);

    const template = this.getTemplate();

    if (this.effect.quality === "DISCONNECTED") {
      this.disconnect();
      this.remount(template);

      return;
    }

    // compare template array and render new
    if (hasTemplateChanged(this.rs, template)) {
      this.remount(template);

      return;
    }

    updateAttributes(this.hooks, this.rs, template);
    const descendantsHaveUpdated = updateDescendants({
      contextParentNode: this.parentNode,
      hooks: this.hooks,
      rs: this.rs,
      template,
    });
    if (descendantsHaveUpdated) {
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

    this.updateEffect("MOUNTED");

    // return future 'left node'
    return descendant;
  }

  unmount(): void {
    // remove parent and left nodes
    this.parentNode = undefined;
    this.leftNode = undefined;

    // remove each sibling
    for (const siblingID in this.siblings) {
      const sibling = this.siblings[siblingID];
      this.hooks.removeDescendant(sibling);
    }

    this.updateEffect("UNMOUNTED");
  }

  disconnect(): void {
    disconnectDescendants(this.hooks, this.rs);
    if (this.state !== undefined && this.chunker.disconnect !== undefined) {
      this.chunker.disconnect({ state: this.state });
    }
    this.updateEffect("DISCONNECTED");
  }

  // CONTEXT API
  //

  getSiblings(): N[] {
    return this.siblings;
  }

  getReferences(): ReferenceMap<N> | undefined {
    // interesting base case outside of contrucutor, might (not) exist
    if (this.rs !== undefined) {
      return this.rs.references;
    }
  }

  getEffect(): ChunkEffect {
    return this.effect;
  }

  private remount(template: Template<N, A>): void {
    // recent change, possibly uneccessary
    // this.unmount();

    this.rs = buildRenderStructure(this.hooks, template);
    this.siblings = getUpdatedSiblings(this.rs);

    this.mount(this.parentNode, this.leftNode);

    this.effect = this.updateEffect("CONNECTED");
  }

  private updateEffect(quality: EffectQuality): ChunkEffect {
    this.effect = {
      timestamp: performance.now(),
      quality,
    };
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
}

const getUpdatedSiblings: GetUpdatedSiblings = (rs) => {
  const siblings = [];

  const originalSiblings = rs.siblings;
  for (const siblingArrayID in originalSiblings) {
    const siblingArray = originalSiblings[siblingArrayID];
    for (const siblingID in siblingArray) {
      const sibling = siblingArray[siblingID];
      siblings.push(sibling);
    }
  }

  return siblings;
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
    hooks.removeAttribute(pastInjection.params);
    pastInjection.params.value = attributeValue;
    hooks.setAttribute(pastInjection.params);
  }
};

const updateDescendants: UpdateDescendantsFunc = ({
  hooks,
  rs,
  template,
  contextParentNode,
}) => {
  let siblingLevelUpdated = false;

  // iterate through descendants
  for (const descenantID in rs.descendants) {
    const pastDescendant = rs.descendants[descenantID];
    const descendant = template.injections[descenantID];

    if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
      const text = String(descendant);
      if (pastDescendant.params.text === text) {
        continue;
      }
    }

    // unmount previous contexts, they could be stale
    if (pastDescendant.kind === "CHUNK_ARRAY") {
      const chunkArray = pastDescendant.params.chunkArray;
      for (const contextID in chunkArray) {
        chunkArray[contextID].unmount();
      }
    }

    // we assume siblings have changed from this point
    const { leftNode, parentNode, siblingIndex } = pastDescendant.params;

    if (!siblingLevelUpdated) {
      siblingLevelUpdated = siblingIndex !== undefined;
    }

    // remove previous descendants
    if (pastDescendant.kind === "TEXT") {
      hooks.removeDescendant(pastDescendant.params.textNode);
    }

    // text descednant
    if (!Array.isArray(descendant)) {
      const text = String(descendant);

      const textNode = hooks.createTextNode(text);
      rs.descendants[descenantID] = {
        kind: "TEXT",
        params: {
          textNode,
          text,
          leftNode,
          parentNode, // save original parent, important
          siblingIndex,
        },
      };

      hooks.insertDescendant({
        descendant: textNode,
        leftNode,
        parentNode: parentNode ?? contextParentNode, // append actual parent
      });

      // add sibling to render structure to get mounted later
      if (siblingIndex !== undefined) {
        rs.siblings[siblingIndex] = [textNode];
      }

      continue;
    }

    const chunkArray = descendant;
    rs.descendants[descenantID] = {
      kind: "CHUNK_ARRAY",
      params: {
        chunkArray,
        leftNode,
        parentNode, // save original parent, important
        siblingIndex,
      },
    };

    let currLeftNode = leftNode;
    for (const contextID in descendant) {
      const chunk = chunkArray[contextID];
      currLeftNode = chunk.mount(parentNode ?? contextParentNode, currLeftNode);
    }

    // we could possibly create a new sibling set here
    // however, its not realy necessary
    // when a context is mounted

    if (pastDescendant.kind === "CHUNK_ARRAY") {
      const chunkArray = pastDescendant.params.chunkArray;
      for (const contextID in chunkArray) {
        const context = chunkArray[contextID];
        const effect = context.getEffect();
        if (effect.quality === "UNMOUNTED") {
          context.disconnect();
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
      for (const contextID in chunkArray) {
        const context = chunkArray[contextID];
        context.unmount();
        context.disconnect();
      }
    }
  }
};

export { Banger, Chunk };
