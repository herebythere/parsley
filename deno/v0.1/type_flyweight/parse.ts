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
  vector: Vector;
}

type BuildStep = NodeStep | InjectionStep | ErrorStep;

interface BuilderInterface {
  push(buildStep: BuildStep): void;
}

const ATTRIBUTE = "ATTRIBUTE";
const ATTRIBUTE_DECLARATION = "ATTRIBUTE_DECLARATION";
const ATTRIBUTE_DECLARATION_CLOSE = "ATTRIBUTE_DECLARATION_CLOSE";
const ATTRIBUTE_SETTER = "ATTRIBUTE_SETTER";
const ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
const CLOSE_NODE_SLASH = "CLOSE_NODE_SLASH";
const CLOSE_NODE_SPACE = "CLOSE_NODE_SPACE";
const CLOSE_NODE_CLOSED = "CLOSE_NODE_CLOSED";
const CLOSE_TAGNAME = "CLOSE_TAGNAME";
const ERROR = "ERROR";
const INDEPENDENT_NODE = "INDEPENDENT_NODE";
const INDEPENDENT_NODE_CLOSED = "INDEPENDENT_NODE_CLOSED";
const NODE = "NODE";
const NODE_CLOSED = "NODE_CLOSED";
const NODE_SPACE = "NODE_SPACE";
const TAGNAME = "TAGNAME";
const TEXT = "TEXT";

export type { BuilderInterface, BuildStep, Routes };

export {
	ATTRIBUTE,
	ATTRIBUTE_DECLARATION,
	ATTRIBUTE_DECLARATION_CLOSE,
	ATTRIBUTE_SETTER,
	ATTRIBUTE_VALUE,
	ERROR,
	CLOSE_NODE_CLOSED,
	CLOSE_NODE_SLASH,
	CLOSE_NODE_SPACE,
	CLOSE_TAGNAME,
	INDEPENDENT_NODE,
	INDEPENDENT_NODE_CLOSED,
	NODE,
	NODE_CLOSED,
	NODE_SPACE,
	TAGNAME,
	TEXT,
}
