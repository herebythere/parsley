// brian taylor vann
// template

// N Node
// A Attributables

import { ChunkBaseArray } from "./chunk.ts";

type AttributeValue<N, A> =
  | A
  | ChunkBaseArray<N>
  | string
  | boolean
  | number
  | undefined;

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: AttributeValue<N, A>[];
}

type Draw<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => Template<N, A>;

export type { AttributeValue, Draw, Template };
