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

type AttributeInjectionAction = {
  type: "INJECTION_ATTRIBUTE";
  vector: Vector;
  valueVector: Vector;
  injectionID: number;
};

interface InjectionAction {
  type: "INJECTION";
  injectionID: number;
}

type IntegralAction =
  | InjectionAction
  | CloseNodeAction
  | ExplicitAttributeAction
  | ImplicitAttributeAction
  | InjectedAttributeAction
  | AttributeInjectionAction
  | NodeAction
  | SelfClosingNodeAction
  | TextAction;

type Integrals = IntegralAction[];

export type {
  InjectionAction,
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
