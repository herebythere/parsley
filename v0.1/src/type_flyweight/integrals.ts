// brian taylor vann
// integral types

import {
  ImplicitAttributeAction,
  ExplicitAttributeAction,
  InjectedAttributeAction,
  AttributeAction,
} from "./attribute_crawl.ts";

import { Vector } from "./text_vector.ts";

interface NodeAction {
  kind: "NODE";
  tagNameVector: Vector;
}
interface SelfClosingNodeAction {
  kind: "SELF_CLOSING_NODE";
  tagNameVector: Vector;
}
interface CloseNodeAction {
  kind: "CLOSE_NODE";
  tagNameVector: Vector;
}

interface TextAction {
  kind: "TEXT";
  textVector: Vector;
}

interface ChunkArrayInjectionAction {
  kind: "CHUNK_ARRAY_INJECTION";
  injectionID: number;
}

type IntegralAction =
  | AttributeAction
  | CloseNodeAction
  | ChunkArrayInjectionAction
  | ExplicitAttributeAction
  | ImplicitAttributeAction
  | InjectedAttributeAction
  | NodeAction
  | SelfClosingNodeAction
  | TextAction;

type Integrals = IntegralAction[];

export type {
  AttributeAction,
  CloseNodeAction,
  ChunkArrayInjectionAction,
  ExplicitAttributeAction,
  ImplicitAttributeAction,
  InjectedAttributeAction,
  IntegralAction,
  Integrals,
  NodeAction,
  SelfClosingNodeAction,
  TextAction,
};
