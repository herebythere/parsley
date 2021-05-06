// brian taylor vann
// template types

// N Node
// A Attributables

import type { ChunkBaseArray, Chunker, ChunkFactory } from "./chunker.ts";

type AttributeValue<N, A> =
  | A
  | ChunkBaseArray<N>
  | string
  | boolean
  | undefined;

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: AttributeValue<N, A>[];
}

type Attach<N> = (parentNode: N, chunkArray: ChunkBaseArray<N>) => void;

type Compose<N, A> = <P = void, S = void>(
  chunker: Chunker<N, A, P, S>
) => ChunkFactory<N, P>;

type Draw<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => Template<N, A>;

export type { Attach, AttributeValue, Compose, Draw, Template };
