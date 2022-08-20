import type { Chunker } from "../type_flyweight/chunker.ts";
import type { Attach, Draw } from "../type_flyweight/template.ts";
import type { Hooks } from "../type_flyweight/hooks.ts";

import { Chunk } from "../fragment/chunk.ts";
import { ReaderInterface, BuilderInterface } from "../type_flyweight/parse.ts";

type ContextFactory<N, A, P, S> = (params: P) => Chunk<N, A, P, S>;


const buildSet = new Set([
  "TEXT",
  "TEXT_COMMENT",
  "TAGNAME",
  "ATTRIBUTE",
  "ATTRIBUTE_VALUE",
  "CLOSE_NODE",
  "CLOSE_TAGNAME",
  "CLOSE_INDEPENDENT_NODE",
  "NODE_CLOSE",
  "CLOSE_NODE",
]);

class Builder implements BuilderInterface {
  private steps: BuildStep = [];

  push(step: BuildStep): void {
    if (buildMap.has(step)) {
      this.steps.push(step)
    }
  }

  getSteps() {
    return this.steps;
  }
}

class Reader implements ReaderInterface {
  private steps: BuildStep = [];

  next(): BuildStep {
    if (buildMap.has(step)) {
      this.steps.push(step)
    }
  }

  reset() {
    this.steps = [];
  }
}

type Compose<N, A> = <P = void, S = void>(
  chunker: Chunker<N, A, P, S>,
) => ContextFactory<N, A, P, S>;

interface ParsleyInterface<N, A> {
  attach: Attach<N>;
  compose: Compose<N, A>;
  draw: Draw<N, A>;
}

type CreateInterface = <N, A>(
  hooks: Hooks<N, A>,
) => ParsleyInterface<N, A>;

const createInterface: ParsleyInterface = <N, A>(
  hooks: Hooks<N, A>,
  reader: ReaderInterface,
  builder: BuilderInterface,
) => {
  const attach: Attach<N> = (parentNode, chunkArray) => {
    let leftNode;

    for (const chunkID in chunkArray) {
      const chunk = chunkArray[chunkID];
      leftNode = chunk.mount(parentNode, leftNode);
    }
  };

  const compose: Compose<N, A> = (chunker) => {
    return (params) => {
      return new Chunk({ hooks, chunker, params });
    };
  };

  // what if we returned a list of descendant siblings?
  // () => nodes or chunk.update() -> node[]
  // not chunk

  const draw: Draw<N, A> = (templateArray, ...injections) => {
    // 
    //
    //

    return {
      templateArray,
      injections,
    };
  };

  return {
    attach,
    compose,
    draw,
  };
};

export type { CreateInterface, Interface };

export { createInterface };
