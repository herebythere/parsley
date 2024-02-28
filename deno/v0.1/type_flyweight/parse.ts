import type { Position, Vector } from "./text_vector.ts";

type Routes = Record<string, string>;

interface NodeStep {
  type: "NODE";
  kind: string;
  vector: Vector;
}

interface InjectionStep {
  type: "INJECT";
  kind: string;
  index: number;
}

type BuildStep = NodeStep | InjectionStep;

interface BuilderInterface {
  push(buildStep: BuildStep): void;
}

export type { BuilderInterface, BuildStep, NodeStep, InjectionStep, Routes };

