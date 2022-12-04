// brian taylor vann
// skeleton crawl types

import type { Position, Vector } from "./text_vector.ts";

type RouterMap = Record<string, string> & {
  DEFAULT: string;
};

type Routers = Record<string, RouterMap>;

interface NodeStep {
  type: "BUILD";
  state: string;
  vector: Vector;
}

interface InjectionStep {
  type: "INJECT";
  state: string;
  index: number;
}

type BuildStep = NodeStep | InjectionStep;

interface BuilderInterface {
  push(buildStep: BuildStep): void;
}

interface Delta {
  prevPos: Position;
  origin: Position;
  prevState: string;
  state: string;
  vector: Vector;
}

export type {
  BuilderInterface,
  BuildStep,
  Delta,
  InjectionStep,
  NodeStep,
  Routers,
};
