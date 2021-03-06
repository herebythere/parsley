// brian taylor vann
// render

// N Node
// A Attributables

import { Template, AttributeValue } from "./template.ts";
import { ContextBaseArray } from "./chunk.ts";

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

interface ContextDescendantParams<N> {
  contextArray: ContextBaseArray<N>;
  parentNode?: N;
  leftNode?: N;
  siblingIndex?: number;
}
interface ContextDescendant<N> {
  kind: "CONTEXT_ARRAY";
  params: ContextDescendantParams<N>;
}

// content injection
interface ContentInjectionParams<N> {
  textNode: N;
  text: string;
  leftNode?: N;
  parentNode?: N;
  siblingIndex?: number;
}
interface ContentInjection<N> {
  kind: "TEXT";
  params: ContentInjectionParams<N>;
}

type Descendant<N> = ContentInjection<N> | ContextDescendant<N>;
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

type Render<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => Template<N, A>;

export type {
  Render,
  RenderStructure,
  ReferenceMap,
  Injection,
  ElementNode,
  TextNode,
};
