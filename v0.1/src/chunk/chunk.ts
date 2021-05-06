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
import {
  getUpdatedSiblings,
  hasTemplateChanged,
  updateAttributes,
  updateDescendants,
  disconnectDescendants,
} from "./chunk_utils.ts";

// Nodes
// Attributes
// Parameters
// State

interface ContextParams<N, A, P, S> {
  hooks: Hooks<N, A>;
  chunker: Chunker<N, A, P, S>;
  params: P;
}

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

export { Banger, Chunk };
