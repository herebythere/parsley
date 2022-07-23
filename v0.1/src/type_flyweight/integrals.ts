// brian taylor vann
// integral types

import type { Vector } from "./text_vector.ts";

interface NodeAction {
  type: "NODE";
  vector: Vector;
}
interface SelfClosingNodeAction {
  type: "INDEPENDENT_NODE";
  vector: Vector;
}
interface CloseNodeAction {
  type: "CLOSE_NODE";
  vector: Vector;
}

interface TextAction {
  type: "TEXT";
  vector: Vector;
}

type ImplicitAttributeAction = {
  type: "IMPLICIT_ATTRIBUTE";
  vector: Vector;
};

type ExplicitAttributeAction = {
  type: "EXPLICIT_ATTRIBUTE";
  vector: Vector;
  valueVector: Vector;
};

type InjectedAttributeAction = {
  type: "INJECTED_ATTRIBUTE";
  vector: Vector;
  valueVector: Vector;
  injectionID: number;
};

interface ChunkArrayInjectionAction {
  type: "INJECTION";
  injectionID: number;
}

type IntegralAction =
  | ChunkArrayInjectionAction
  | CloseNodeAction
  | ExplicitAttributeAction
  | ImplicitAttributeAction
  | InjectedAttributeAction
  | NodeAction
  | SelfClosingNodeAction
  | TextAction;

type Integrals = IntegralAction[];

export type {
  ChunkArrayInjectionAction,
  CloseNodeAction,
  ExplicitAttributeAction,
  ImplicitAttributeAction,
  InjectedAttributeAction,
  IntegralAction,
  Integrals,
  NodeAction,
  SelfClosingNodeAction,
  TextAction,
};
