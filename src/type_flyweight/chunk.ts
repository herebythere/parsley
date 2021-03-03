// brian taylor vann
// context

import { ReferenceMap } from "./render";

// UNMOUNTED      // siblings have no parent
// MOUNTED        // siblings have a parent
// CONNECTED      // descendants are attached to siblings
// DISCONNECTED   // desendants are removed from siblings

type EffectQuality = "CONNECTED" | "UNMOUNTED" | "MOUNTED" | "DISCONNECTED";

type ContextEffect = {
  quality: EffectQuality;
  timestamp: number;
};

interface BangerBase<N> {
  context: ContextBase<N>;
  bang(): void;
  getReferences(): ReferenceMap<N> | undefined;
}

class ContextBase<N> {
  // parent node reference
  // left node reference

  mount(parentNode?: N, leftNode?: N): N | undefined {
    // attach siblings to parent
    // return leftmost node
    return;
  }
  unmount(): void {
    // remove siblings but don't disconnect descendants
  }
  bang(): void {
    // update using previous parameters
  }
  getReferences(): ReferenceMap<N> | undefined {
    // get rendered reference pointers (*)
    return;
  }
  update(p: unknown): void {
    // if template fundamentally changes?
    //   unmount, disconnect, render
    //
    // if siblings are different
    //   create new siblings
  }
  disconnect(): void {
    // remove siblings
    // call chunker.disconnect()
  }
  getSiblings(): N[] {
    // return siblings so parent chunk can mount
    return [];
  }
  getEffect(): ContextEffect {
    return {
      quality: "UNMOUNTED",
      timestamp: performance.now(),
    };
  }
}

type ContextBaseArray<N> = ContextBase<N>[];

export {
  BangerBase,
  ContextBase,
  ContextBaseArray,
  ContextEffect,
  EffectQuality,
};
