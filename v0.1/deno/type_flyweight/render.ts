// brian taylor vann
// render types

// N Node
// A Attributables

import type { BuildStep } from "./crawl.ts";

interface Chunk { };

interface AttributeInjection<N, A> {
  kind: "ATTRIBUTE";
  node: N;
  attribute: string;
  value: string;
}

interface AttributeMapInjection<N, A> {
  kind: "ATTRIBUTE_MAP";
  node: N;
  attributeMap: Map<string, A>;
}

interface ChunkDescendant<N> {
  kind: "CHUNK";
  chunkArray: Chunk[];
  parentNode?: N;
  leftNode?: N;
}

type Injection<N, A> =
  AttributeInjection<N, A> |
  ChunkDescendant<N> |
  AttributeMapInjection<N, A>;

type ReferenceMap<N> = Record<string, N>;

interface RenderStructure<N, A> {
  injections: Injection<N, A>[];
  references: ReferenceMap<N>;
  siblings: N[];
}

type RenderStack<N, A> {
  templates: Template<N, A>[],
  steps: BuildStep[]
}

export type { RenderStack, ReferenceMap, RenderStructure };
