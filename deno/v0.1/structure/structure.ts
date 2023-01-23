// create a fragment

// get a reader
// use a builder
//

// enqueue a node
// add attribute
// add add attribute value
// pop node
//
// enqueue a set of children
// retain the top and left node

// stack queue
//

// brian taylor vann
// build render

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { RenderStructure, Stack } from "../type_flyweight/fragment.ts";

import { BuildStep } from "../type_flyweight/parse.ts";

interface ReaderInterface {
  next(): BuildStep | undefined;
  reset(): void;
}

type BuildStructure = <N, A>(
  hooks: Hooks<N, A>,
  reader: ReaderInterface,
  renderStructure: RenderStructure<N, A>,
  stack: Stack<N>,
) => void;

type BuildHelper = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
  stack: Stack<N>,
  step: BuildStep,
  nextStep?: BuildStep,
) => void;

/* const fragmentSet = new Set([
  // node and attributes
  "TAGNAME",
  "ATTRIBUTE_VALUE",
  "ATTRIBUTE",
  "CLOSE_NODE",
  "CLOSE_INDEPENDENT_NODE",

  // pop node
  "CLOSE_NODE",
  "CLOSE_TAGNAME",
  "TEXT",
]); */

const createFragment = <N, A>(): RenderStructure<N, A> => ({
  injections: [],
  references: new Map(),
  siblings: [],
  error: undefined,
});

const createStack = <N>(): Stack<N> => ({
  nodes: [],
  node: undefined,
  attributeStep: undefined,
});

const pushNode: BuildHelper = (hooks, rs, stack, step) => {
  if (step.type !== "BUILD" || stack.node === undefined) return;

  const parentNodes = stack.nodes[stack.nodes.length - 2];
  const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];

  const rowNodes = stack.nodes[stack.nodes.length - 1];
  const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];

  hooks.insertDescendant(stack.node, parentNode, leftNode);

  const length = stack.nodes[stack.nodes.length - 1]?.push(stack.node);
  if (length === undefined) {
    stack.nodes.push([stack.node]);
  }
  if (stack.nodes.length === 1) {
    rs.siblings.push(stack.node);
  }
  stack.node = undefined;
};

const createTextNode: BuildHelper = (hooks, rs, stack, step) => {
  if (step.type !== "BUILD") return;

  const parentNodes = stack.nodes[stack.nodes.length - 2];
  const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];

  const rowNodes = stack.nodes[stack.nodes.length - 1];
  const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];
  const descendant = hooks.createTextNode(step.value);

  hooks.insertDescendant(descendant, parentNode, leftNode);
  if (stack.nodes.length === 1) {
    rs.siblings.push(descendant);
  }
};

const setAttribute = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
  stack: Stack<N>,
  step: BuildStep,
) => {
  if (
    stack?.node === undefined || stack?.attributeStep?.type !== "BUILD" ||
    step?.type !== "BUILD"
  ) return;
  if (step.state === "ATTRIBUTE_VALUE") {
    hooks.setAttribute(stack.node, stack?.attributeStep.value, step.value);
    return;
  }

  hooks.setAttribute(stack.node, stack?.attributeStep?.value);
};

const popNode: BuildHelper = (hooks, rs, stack, step) => {
  const node = stack.nodes[stack.nodes.length - 1]?.pop();
  if (node === undefined) {
    stack.nodes.pop();
  }
};

const buildStructure: BuildStructure = (hooks, reader, rs, stack) => {
  // also go by two stepping and deltas
  reader.reset();

  let step = reader.next();
  while (step) {
    if (step.type === "BUILD") {
      // NODE
      //
      if (step.state === "TAGNAME") {
        stack.node = hooks.createNode(step.value);
      }

      // TEXT
      //
      if (step.state === "TEXT") {
        createTextNode(hooks, rs, stack, step);
      }

      // ATTRIBUTE
      //  set attribute name in stack
      //
      if (step.state === "ATTRIBUTE") {
        stack.attributeStep = step;
      }
      if (
        stack.attributeStep && stack.node && (
          step.state === "SPACE_NODE" ||
          step.state === "ATTRIBUTE_VALUE" ||
          step.state === "CLOSE_NODE"
        )
      ) {
        setAttribute(hooks, rs, stack, step);
        stack.attributeStep = undefined;
      }

      // NODE_CLOSE
      //   if attribute but not attribute value
      //     set attribute and attribute value to undefined
      //
      if (step.state === "CLOSE_NODE") {
        pushNode(hooks, rs, stack, step);
      }

      if (
        step.state === "CLOSE_NODE_CLOSER" ||
        step.state === "CLOSE_INDEPENDENT_CLOSE"
      ) {
        pushNode(hooks, rs, stack, step);
        popNode(hooks, rs, stack, step);
      }
    }

    if (step.type === "INJECT") {
      // ATTRIBUTE INJECITON
      //   add to injecitons
      //
      if (step.state === "ATTRIBUTE") {
      }

      // ATTRIBUTE MAP INJECITON
      //   add to injecitons
      //
      if (step.state === "ATTRIBUTE_MAP") {
        // set attribute map
      }

      if (step.state === "DESCENDANT") {
        // parent
        // left
        //
        // iterate and add descendant
      }
    }

    step = reader.next();
  }
};

export type { ReaderInterface };

export { buildStructure, createFragment, createStack };
