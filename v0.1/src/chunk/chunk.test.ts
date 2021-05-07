// brian taylor vann
// chunk

import type { Chunker } from "../type_flyweight/chunker.ts";
import type { TestNode } from "../test_hooks/test_element.ts";

import { Chunk } from "./chunk.ts";
import { draw, hooks, TestAttributes } from "../test_hooks/test_hooks.ts";

const title = "context";
const runTestsAsynchronously = true;

// N Node
// A Attribute
// P Params
// S state

const numberChunker: Chunker<TestNode, TestAttributes, number, void> = {
  update: ({ params }) => {
    return draw`${params}`;
  },
  connect: () => {},
  disconnect: () => {},
};

const createSimpleContext = () => {
  const assertions = [];

  const params = 5;
  const context = new Chunk({ hooks, params, chunker: numberChunker });
  const siblings = context.getSiblings();

  if (siblings.length !== 3) {
    assertions.push("context should have 2 siblings");
  }

  const textNode = siblings[1];
  if (textNode === undefined) {
    assertions.push("right sentinel should not be undefined");
    return assertions;
  }
  if (textNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (textNode.kind === "TEXT" && textNode.text !== "5") {
    assertions.push("node after left setinel should have text as 5");
  }

  return assertions;
};

const mountAndUnmountSimpleComponent = () => {
  const assertions = [];

  const params = 5;
  const context = new Chunk({ hooks, params, chunker: numberChunker });

  const parentNode = hooks.createNode("div");
  let siblings = context.getSiblings();

  // mount component
  context.mount(parentNode);

  if (siblings.length !== 3) {
    assertions.push("context should have 2 siblings");
  }

  const textNode = siblings[1];
  if (textNode === undefined) {
    assertions.push("right sentinel should not be undefined");
    return assertions;
  }
  if (textNode.parent !== parentNode) {
    assertions.push("parent node should be 'div' instance");
  }
  if (textNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (textNode.kind === "TEXT" && textNode.text !== "5") {
    assertions.push("node after left setinel should have text as 5");
  }

  // unmount component
  context.unmount();

  siblings = context.getSiblings();
  for (const siblingID in siblings) {
    const descendant = siblings[siblingID];
    if (descendant.parent !== undefined) {
      assertions.push("siblings should not have a parent");
    }
    if (descendant.left !== undefined) {
      assertions.push("siblings should not have a left sibling");
    }
    if (descendant.right !== undefined) {
      assertions.push("siblings should not have a left sibling");
    }
  }

  return assertions;
};

const updateContextSimpleContext = () => {
  const assertions = [];

  // we want siblings to update

  const params = 5;
  const context = new Chunk({ hooks, params, chunker: numberChunker });

  const parentNode = hooks.createNode("div");
  context.mount(parentNode);

  let siblings = context.getSiblings();

  if (siblings.length !== 3) {
    assertions.push("context should have 2 siblings");
  }

  let textNode = siblings[1];
  if (textNode === undefined) {
    assertions.push("right sentinel should not be undefined");
    return assertions;
  }
  if (textNode.parent !== parentNode) {
    assertions.push("parent node should be 'div' instance");
  }
  if (textNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (textNode.kind === "TEXT" && textNode.text !== "5") {
    assertions.push("node after left setinel should have text as 5");
  }

  context.update(6);

  siblings = context.getSiblings();

  textNode = siblings[1];

  if (textNode.kind === "TEXT" && textNode.text !== "6") {
    assertions.push("node after left setinel should have text as 5");
  }

  for (const siblingID in siblings) {
    const descendant = siblings[siblingID];

    if (descendant.parent !== parentNode) {
      assertions.push("siblings should have parent node instance");
    }
  }

  return assertions;
};

const createAndUpdateDescendantContextArray = () => {
  const assertions = [];

  const params = 5;

  const numberContext = new Chunk({ hooks, params, chunker: numberChunker });
  const parentChunker: Chunker<TestNode, TestAttributes, number, void> = {
    update: ({ params, state }) => {
      numberContext.update(params);
      return draw`<p>${[numberContext]}</p>`;
    },
    connect: () => {},
    disconnect: () => {},
  };

  const parentContext = new Chunk({ hooks, params, chunker: parentChunker });

  let siblings = parentContext.getSiblings();

  if (siblings.length !== 1) {
    assertions.push("context should have 1 siblings");
  }

  const textNode = siblings[0];
  if (textNode === undefined) {
    assertions.push("descendant textNode should exist");
    return assertions;
  }
  if (textNode.kind !== "ELEMENT") {
    assertions.push("node after left sentinel should be an ELEMENT");
  }
  if (textNode.kind === "ELEMENT" && textNode.tagname !== "p") {
    assertions.push("node after left setinel should have text as 5");
  }

  parentContext.update(6);
  if (siblings[0].kind !== "ELEMENT") {
    assertions.push("updated parent siblings should be an ELEMENT");
    return assertions;
  }

  const updatedTextNode = siblings[0]?.leftChild?.right;
  siblings = parentContext.getSiblings();

  if (updatedTextNode === undefined) {
    assertions.push("updated descendant updatedTextNode should exist");
    return assertions;
  }
  if (updatedTextNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
    assertions.push("node after left setinel should have text as '6'");
  }

  return assertions;
};

const createAndUpdateDescendantSiblingContextArray = () => {
  const assertions = [];

  const params = 5;

  const numberContext = new Chunk({ hooks, params, chunker: numberChunker });
  const parentChunker: Chunker<TestNode, TestAttributes, number, void> = {
    update: ({ params, state }) => {
      numberContext.update(params);
      return draw`${[numberContext]}`;
    },
    connect: () => {},
    disconnect: () => {},
  };

  const parentContext = new Chunk({ hooks, params, chunker: parentChunker });

  const siblings = parentContext.getSiblings();

  if (siblings.length !== 5) {
    assertions.push("context should have 5 siblings");
  }

  parentContext.update(6);

  const numberSiblings = numberContext.getSiblings();

  if (numberSiblings.length !== 3) {
    assertions.push("context should have 5 siblings");
  }

  const updatedTextNode = numberSiblings[1];

  if (updatedTextNode === undefined) {
    assertions.push("updated descendant updatedTextNode should exist");
    return assertions;
  }
  if (updatedTextNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
    assertions.push("node after left setinel should have text as '6'");
  }

  return assertions;
};

const createAndUpdateMultipleDescendants = () => {
  const assertions = [];

  const params = 5;

  const numberContext = new Chunk({ hooks, params, chunker: numberChunker });
  const otherNumberContext = new Chunk({
    hooks,
    params,
    chunker: numberChunker,
  });

  const parentChunker: Chunker<TestNode, TestAttributes, number, void> = {
    update: ({ params }) => {
      numberContext.update(params);
      return draw`${[numberContext, otherNumberContext]}`;
    },
    connect: () => {},
    disconnect: () => {},
  };

  const parentContext = new Chunk({ hooks, params, chunker: parentChunker });

  const siblings = parentContext.getSiblings();

  if (siblings.length !== 8) {
    assertions.push("context should have 8 siblings");
  }

  parentContext.update(6);

  const numberSiblings = numberContext.getSiblings();
  const otherSiblings = otherNumberContext.getSiblings();

  if (siblings.length !== 8) {
    assertions.push("context should have 8 siblings");
  }

  const updatedTextNode = numberSiblings[1];
  const updatedOtherTextNode = otherSiblings[1];

  if (updatedTextNode === undefined) {
    assertions.push("updated descendant updatedTextNode should exist");
    return assertions;
  }
  if (updatedTextNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
    assertions.push("node after left setinel should have text as '6'");
  }
  if (updatedOtherTextNode.kind !== "TEXT") {
    assertions.push("node after left sentinel should be a TEXT");
  }
  if (
    updatedOtherTextNode.kind === "TEXT" &&
    updatedOtherTextNode.text !== "5"
  ) {
    assertions.push("node after left setinel should have text as '5'");
  }

  return assertions;
};

const tests = [
  createSimpleContext,
  mountAndUnmountSimpleComponent,
  updateContextSimpleContext,
  createAndUpdateDescendantContextArray,
  createAndUpdateDescendantSiblingContextArray,
  createAndUpdateMultipleDescendants,
];

const unitTestContext = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestContext };
