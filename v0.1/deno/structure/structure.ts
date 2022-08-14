// brian taylor vann
// build render

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { Template } from "../type_flyweight/template.ts";
import type { RenderStructure } from "../type_flyweight/render.ts";

import { getText } from "../text_vector/text_vector.ts";
import { BuildStep } from "../type_flyweight/crawl.ts";

// Here a "READER" is necessary
// a next() next() relationship
// could be from file or not, but reading steps one at a time.

type BuildRender = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure,
  step: BuildStep,
) => RenderStructure<N, A>;

type BuildHelper = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
  step: BuildStep,
) => void;

type BuildHelperNoHooks = <N, A>(
  rs: RenderStructure<N, A>,
  step: BuildStep,
) => void;

// Separate render from build

// if not big enough for memory it will be a write driven process
// get build steps -> write build steps to file
// read build steps -> get build steps one line at a time
//
// structure builder becomes about steps
// next() next next until undefined
// reset() -> 0 index mark

interface ReaderInterface {
  next(): BuildStep | undefined;
}

const createRenderStructure = <N, A>(): RenderStructure<N, A> => {
  return {
    injections: new Map(),
    references: new Map(),
    siblings: [],
  };
}

const createNode: BuildHelper = (hooks, rs, integral) => {
  const tagName = getText(rs.template, integral.vector);
  if (tagName === undefined) return;

  const parentNodes = rs.stack[rs.stack.length - 2];
  const parentNode = parentNodes?.[parentNodes?.length - 1 ?? 0];

  const rowNodes = rs.stack[rs.stack.length - 1];
  const leftNode = rowNodes?.[rowNodes?.length - 1 ?? 0];
  const descendant = hooks.createNode(tagName);

  rs.stack.push([descendant]);
  hooks.insertDescendant(descendant, parentNode, leftNode);
};

const closeNode: BuildHelperNoHooks = (rs, integral) => {
  const tagName = getText(rs.template, integral.vector);
  if (tagName === undefined) return;

  const rowNodes = rs.stack[rs.stack.length - 1];
  if (!rowNodes.pop()) {
    rs.stack.pop();
  } 
};

const createTextNode: BuildHelper = (hooks, rs, integral) => {
  const text = getText(rs.template, integral.vector);
  if (text === undefined) return;

  const parentNodes = rs.stack[rs.stack.length - 2];
  const parentNode = parentNodes?.[parentNodes?.length - 1 ?? 0];

  const rowNodes = rs.stack[rs.stack.length - 1];
  const leftNode = rowNodes?.[rowNodes?.length - 1 ?? 0];
  const descendant = hooks.createTextNode(text);

  rs.stack.push([descendant]);
  hooks.insertDescendant(descendant, parentNode, leftNode);
};

const buildRender: BuildRender = (hooks, reader, rs) => {
  let step = reader.next();
  while(step) {
    if (step.type === "NODE") {
      createNode(hooks, rs, step);
    }
    if (step.type === "CLOSE_NODE" || step.type === "CLOSE_INDEPENDENT_NODE") {
      closeNode(rs, step);
    }
    if (step.kind === "TEXT") {
      createTextNode(hooks, rs, step);
    }

      // if (step.kind === "CHUNK_ARRAY_INJECTION") {
    //   createChunkArrayInjection(hooks, rs, step);
    // }
    // if (step.kind === "EXPLICIT_ATTRIBUTE") {
    //   appendExplicitAttribute(hooks, rs, step);
    // }
    // if (step.kind === "IMPLICIT_ATTRIBUTE") {
    //   appendImplicitAttribute(hooks, rs, step);
    // }
    // if (step.kind === "ATTRIBUTE_INJECTION") {
    //   appendInjectedAttribute(hooks, rs, step);
    // }

    step = reader.next()
  }

  return rs;
};


export {

  // appendExplicitAttribute,
  // appendImplicitAttribute,
  // appendInjectedAttribute,
  buildRender,
  // closeNode,
  // createChunkArrayInjection,
  // createNode,
  // createTextNode,
};
