import type { Chunker } from "../type_flyweight/chunker.ts";
import type { Attach, Draw } from "../type_flyweight/template.ts";
import type { Hooks } from "../type_flyweight/hooks.ts";

import { Chunk } from "../chunk/chunk.ts";

type ContextFactory<N, A, P, S> = (params: P) => Chunk<N, A, P, S>;

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

  const draw: Draw<N, A> = (templateArray, ...injections) => {
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
