// brian taylor vann
// render types

// N Node
// A Attributables

import type { AttributeValue } from "./template.ts";
import type { BuildStep } from "./crawl.ts";

interface AttributeInjection<N, A> {
  kind: "ATTRIBUTE";
  node: N;
  attribute: string;
  value: AttributeValue<N, A>;}

type AttributeMap<N, A> = Map<number, AttributeInjection<N, A>>;

interface ChunkDescendant<N> {
  kind: "CHUNK_ARRAY";
  chunkArray: N[];
  parentNode?: N;
  leftNode?: N;
}

interface TextInjectionParams<N> {
  textNode: N;
  text: string;
  leftNode?: N;
  parentNode?: N;
}
interface TextInjection<N> {
  kind: "TEXT";
  params: TextInjectionParams<N>;
}

type Descendant<N> = TextInjection<N> | ChunkDescendant<N>;
type DescendantMap<N> = Record<number, Descendant<N>>;
type ReferenceMap<N> = Record<string, N>;

interface ElementNode<N> {
  kind: "NODE";
  tagName: string;
  node: N;
}

interface TextNode<N> {
  kind: "TEXT";
  node: N;
}

type LastNode<N> = N | undefined;

interface RenderStructure<N, A> {
  descendants: DescendantMap<N>;
  attributes: AttributeMap<N, A>;
  references: ReferenceMap<N>;
  siblings: N[][];
}

interface RenderStack<N> {
  lastNodes: LastNode<N>[];
  stack: BuildStep<N>[];
}

export type { ElementNode, RenderStack, ReferenceMap, RenderStructure, TextNode };
