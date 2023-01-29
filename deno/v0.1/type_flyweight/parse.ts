import type { Position, Vector } from "./text_vector.ts";

type RouterMap = Record<string, string> & {
  DEFAULT: string;
};

type Routes = Record<string, RouterMap>;

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

interface ErrorStep {
  type: "ERROR";
  state: string;
  vector: Vector;
}

type BuildStep = NodeStep | InjectionStep | ErrorStep;

interface BuilderInterface {
  push(buildStep: BuildStep): void;
}

export type { BuilderInterface, BuildStep, Routes };
