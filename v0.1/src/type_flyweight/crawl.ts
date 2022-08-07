// brian taylor vann
// skeleton crawl types

import type { Vector, Position } from "./text_vector.ts";


interface NodeStep {
  type: 'build';
  state: string;
  vector: Vector;
}

interface InjectionStep {
  type: 'injection';
  state: string;
  index: number;
}

type BuildStep = NodeStep | InjectionStep;

interface ResultsBuilderInterface {
  push(buildStep: BuildStep): void;
  // done(): void;
}

interface DeltaCrawl {
  prevPos: Position;
  origin: Position;
  prevState: string;
  state: string;
  vector: Vector;
}

export type { DeltaCrawl, BuildStep, ResultsBuilderInterface };
