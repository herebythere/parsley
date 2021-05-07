// brian taylor vann
// attribute crawl types

import type { Vector } from "./text_vector.ts";

type ImplicitAttributeAction = {
  kind: "IMPLICIT_ATTRIBUTE";
  attributeVector: Vector;
};

type ExplicitAttributeAction = {
  kind: "EXPLICIT_ATTRIBUTE";
  attributeVector: Vector;
  valueVector: Vector;
};

type InjectedAttributeAction = {
  kind: "INJECTED_ATTRIBUTE";
  attributeVector: Vector;
  valueVector: Vector;
  injectionID: number;
};

type AttributeAction =
  | ImplicitAttributeAction
  | ExplicitAttributeAction
  | InjectedAttributeAction;

export type {
  AttributeAction,
  ExplicitAttributeAction,
  ImplicitAttributeAction,
  InjectedAttributeAction,
};
