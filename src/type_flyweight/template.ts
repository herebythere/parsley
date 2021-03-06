// brian taylor vann
// template

// N Node
// A Attributables

import { ContextBaseArray } from "./chunk.ts";

type AttributeValue<N, A> =
  | ContextBaseArray<N>
  | A
  | string
  | boolean
  | number
  | undefined;

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: AttributeValue<N, A>[];
}

type Render<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => Template<N, A>;

export type { AttributeValue, Render, Template };
