// brian taylor vann
// render types

// N Node
// A Attributables

import type { AttributeValue, Template } from "./template.ts";
import type { ChunkBaseArray } from "./chunker.ts";

interface AttributeInjectionParams<N, A> {
  references: ReferenceMap<N>;
  node: N;
  attribute: string;
  value: AttributeValue<N, A>;
}

interface AttributeInjection<N, A> {
  kind: "ATTRIBUTE";
  params: AttributeInjectionParams<N, A>;
}

type Injection<N, A> = AttributeInjection<N, A>;
type AttributeMap<N, A> = Record<number, Injection<N, A>>;

interface ChunkDescendantParams<N> {
  chunkArray: ChunkBaseArray<N>;
  parentNode?: N;
  leftNode?: N;
  siblingIndex?: number;
}
interface ChunkDescendant<N> {
  kind: "CHUNK_ARRAY";
  params: ChunkDescendantParams<N>;
}

interface TextInjectionParams<N> {
  textNode: N;
  text: string;
  leftNode?: N;
  parentNode?: N;
  siblingIndex?: number;
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
  selfClosing: boolean;
}

interface TextNode<N> {
  kind: "TEXT";
  node: N;
}

type StackBit<N> = ElementNode<N> | TextNode<N>;
type LastNode<N> = N | undefined;

interface RenderStructure<N, A> {
  descendants: DescendantMap<N>;
  attributes: AttributeMap<N, A>;
  references: ReferenceMap<N>;
  lastNodes: LastNode<N>[];
  siblings: N[][];
  stack: StackBit<N>[];
  template: Template<N, A>;
}

export type { ElementNode, Injection, ReferenceMap, RenderStructure, TextNode };
