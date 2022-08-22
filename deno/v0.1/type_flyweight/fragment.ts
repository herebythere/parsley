// brian taylor vann
// render types

// N Node
// A Attributables

import type { BuildStep } from "./parse.ts"

interface Chunk<N> {
  mount(parent?: N, left?: N): void; // add 
  getDescendants(): void;
};
// what is a chunk?
// has props, parent, left, descendants
// update, connected, 

interface AttributeInjection<N, A> {
  type: "ATTRIBUTE";
  node: N;
  attribute: string;
  value: A;
}

interface AttributeMapInjection<N, A> {
  type: "ATTRIBUTE_MAP";
  node: N;
  attributeMap: Map<string, A>;
}

interface ChunkDescendant<N> {
  type: "CHUNK";
  chunk: Chunk<N>;
  parentNode?: N;
  leftNode?: N;
}

type Injection<N, A> =
  AttributeInjection<N, A> |
  ChunkDescendant<N> |
  AttributeMapInjection<N, A>;

type ReferenceMap<N> = Map<string, N>;

interface RenderStructure<N, A> {
  injections: Injection<N, A>[];
  descendants: ChunkDescendant<N>,
  references: ReferenceMap<N>;
  siblings: N[];
  error?: string;
}

interface Stack<N> {
  nodes: N[][];
  node?: N;
  attributeStep?: BuildStep;
}

interface Fragment<N, A, P> {
  children(): N[];
  update(params: P): void;
  connect(): void;
  disconnect(): void;
}

export type { ReferenceMap, RenderStructure, Stack, Fragment };
