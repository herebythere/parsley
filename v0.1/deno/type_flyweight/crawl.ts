// brian taylor vann
// skeleton crawl types

import type { Vector, Position } from "./text_vector.ts";

interface NodeStep {
  type: 'build';
  state: string;
  vector: Vector;
  value?: string;
}

interface InjectionStep {
  type: 'inject';
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

export type { Delta, NodeStep, InjectionStep, BuildStep, BuilderInterface };
