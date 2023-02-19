import type { Vector } from "../type_flyweight/text_vector.ts";
import type { BuilderInterface, BuildStep } from "../type_flyweight/parse.ts";

import { parse } from "./parse.ts";
import { samestuff } from "../test_deps.ts";

import {
  ATTRIBUTE,
  ATTRIBUTE_DECLARATION,
  ATTRIBUTE_DECLARATION_CLOSE,
  ATTRIBUTE_INJECTION,
  ATTRIBUTE_INJECTION_MAP,
  ATTRIBUTE_SETTER,
  ATTRIBUTE_VALUE,
  BUILD,
  CLOSE_NODE_CLOSED,
  CLOSE_NODE_SLASH,
  CLOSE_NODE_SPACE,
  CLOSE_TAGNAME,
  DEFAULT,
  DESCENDANT_INJECTION,
  ERROR,
  INDEPENDENT_NODE,
  INDEPENDENT_NODE_CLOSED,
  INITIAL,
  INJECT,
  NODE,
  NODE_CLOSED,
  NODE_SPACE,
  TAGNAME,
  TEXT,
} from "../type_flyweight/constants.ts";

const title = "** parse tests **";
const runTestsAsynchronously = true;

function testTextInterpolator<I>(
  templateArray: TemplateStringsArray,
  ...injections: I[]
) {
  return templateArray;
}

// nodes

function parseNodeTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello>`;
  const expectedResults = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_CLOSED,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithImplicitAttributeTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello attribute>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } },
    },
    {
      type: BUILD,
      state: NODE_CLOSED,
      vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithImplicitAttributeWithSpacesTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello  attribute  >`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 18 } },
    },
    {
      type: BUILD,
      state: NODE_CLOSED,
      vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 19 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// independent nodes

function parseIndependentNodeTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 7 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseIndependentNodeWithImplicitAttributeTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello attribute/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseIndependentNodeWithImplicitAttributeWithSpacesTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello  attribute  />`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 18 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 19 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 0, y: 20 }, target: { x: 0, y: 20 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// explicit attributes

function parseExplicitAttributeTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello attribute="value"/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_SETTER,
      vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION,
      vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_VALUE,
      vector: { origin: { x: 0, y: 18 }, target: { x: 0, y: 22 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION_CLOSE,
      vector: { origin: { x: 0, y: 23 }, target: { x: 0, y: 23 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 0, y: 24 }, target: { x: 0, y: 24 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 0, y: 25 }, target: { x: 0, y: 25 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseExplicitAttributeWithSpacesTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello  attribute="value"  />`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_SETTER,
      vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION,
      vector: { origin: { x: 0, y: 18 }, target: { x: 0, y: 18 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_VALUE,
      vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 23 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION_CLOSE,
      vector: { origin: { x: 0, y: 24 }, target: { x: 0, y: 24 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 25 }, target: { x: 0, y: 26 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 0, y: 27 }, target: { x: 0, y: 27 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 0, y: 28 }, target: { x: 0, y: 28 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// injections

function parseNodeInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello>${"hi"}</hello>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_CLOSED,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    { type: INJECT, index: 0, state: DESCENDANT_INJECTION },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    {
      type: BUILD,
      state: CLOSE_NODE_SLASH,
      vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } },
    },
    {
      type: BUILD,
      state: CLOSE_TAGNAME,
      vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 6 } },
    },
    {
      type: BUILD,
      state: CLOSE_NODE_CLOSED,
      vector: { origin: { x: 1, y: 7 }, target: { x: 1, y: 7 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithAttributeInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello world="${"world"}"/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 11 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_SETTER,
      vector: { origin: { x: 0, y: 12 }, target: { x: 0, y: 12 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION,
      vector: { origin: { x: 0, y: 13 }, target: { x: 0, y: 13 } },
    },
    { type: INJECT, index: 0, state: ATTRIBUTE_INJECTION },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION_CLOSE,
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 2 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithAttributeInjectionsWithSpacesTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello world="${"world"}  "/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE,
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 11 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_SETTER,
      vector: { origin: { x: 0, y: 12 }, target: { x: 0, y: 12 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION,
      vector: { origin: { x: 0, y: 13 }, target: { x: 0, y: 13 } },
    },
    { type: INJECT, index: 0, state: ATTRIBUTE_INJECTION },
    {
      type: BUILD,
      state: ATTRIBUTE_VALUE,
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 1 } },
    },
    {
      type: BUILD,
      state: ATTRIBUTE_DECLARATION_CLOSE,
      vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 2 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 1, y: 3 }, target: { x: 1, y: 3 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 1, y: 4 }, target: { x: 1, y: 4 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithAttributeMultipleInjectionsWithSpacesTest() {
  const assertions = [];
  const textVector =
    testTextInterpolator`<hello world="  ${"milky way"}  ${"galaxy"}   "/>`;
  const expectedResults: BuildStep[] = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: "BUILD",
      state: "NODE_SPACE",
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE",
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 11 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_SETTER",
      vector: { origin: { x: 0, y: 12 }, target: { x: 0, y: 12 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_DECLARATION",
      vector: { origin: { x: 0, y: 13 }, target: { x: 0, y: 13 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_VALUE",
      vector: { origin: { x: 0, y: 14 }, target: { x: 0, y: 15 } },
    },
    { type: "INJECT", index: 0, state: "ATTRIBUTE_INJECTION" },
    {
      type: "BUILD",
      state: "ATTRIBUTE_VALUE",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 1 } },
    },
    { type: "INJECT", index: 1, state: "ATTRIBUTE_INJECTION" },
    {
      type: "BUILD",
      state: "ATTRIBUTE_VALUE",
      vector: { origin: { x: 2, y: 0 }, target: { x: 2, y: 2 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_DECLARATION_CLOSE",
      vector: { origin: { x: 2, y: 3 }, target: { x: 2, y: 3 } },
    },
    {
      type: "BUILD",
      state: "INDEPENDENT_NODE",
      vector: { origin: { x: 2, y: 4 }, target: { x: 2, y: 4 } },
    },
    {
      type: "BUILD",
      state: "INDEPENDENT_NODE_CLOSED",
      vector: { origin: { x: 2, y: 5 }, target: { x: 2, y: 5 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithAttributeMapInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`<hello ${"world"}/>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: TAGNAME,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } },
    },
    {
      type: BUILD,
      state: NODE_SPACE,
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    { type: INJECT, index: 0, state: ATTRIBUTE_INJECTION_MAP },
    {
      type: BUILD,
      state: INDEPENDENT_NODE,
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    {
      type: BUILD,
      state: INDEPENDENT_NODE_CLOSED,
      vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// errors

function parseErrorTest() {
  const assertions = [];
  const textVector = testTextInterpolator`< a>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: ERROR,
      vector: { origin: { x: 0, y: 2 }, target: { x: 0, y: 2 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseCloseNodeErrorTest() {
  const assertions = [];
  const textVector = testTextInterpolator`</ a>`;
  const expectedResults: BuildStep[] = [
    {
      type: BUILD,
      state: INITIAL,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: NODE,
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: BUILD,
      state: CLOSE_NODE_SLASH,
      vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 1 } },
    },
    {
      type: BUILD,
      state: ERROR,
      vector: { origin: { x: 0, y: 3 }, target: { x: 0, y: 3 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// fail safes

function parseEmptyTest() {
  const assertions = [];
  const textVector = testTextInterpolator``;
  const expectedResults: BuildStep[] = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseEmptyWithInjectionTest() {
  const assertions = [];
  const textVector = testTextInterpolator`${"buster"}`;
  const expectedResults: BuildStep[] = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    { type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseEmptyWithMultipleInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`${"yo"}${"buddy"}${"boi"}`;
  const expectedResults: BuildStep[] = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    { type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    { type: "INJECT", index: 1, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 2, y: 0 }, target: { x: 2, y: 0 } },
    },
    { type: "INJECT", index: 2, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 3, y: 0 }, target: { x: 3, y: 0 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

// real world

function parseNestedTemplateWithInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`${"stardust"}
  	<boop sunshine>${"yo"}<beep>hai</beep>
  		<doh ${"moonlight"}>${"buddy"}</doh><howdy starshine="darlin" />
  		<chomp>:3</chomp>
  		${"wolfy"}
  	</boop>
  ${"galaxy"}`;

  const expectedResults: BuildStep[] = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    { type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 3 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 4 }, target: { x: 1, y: 4 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 1, y: 5 }, target: { x: 1, y: 8 } },
    },
    {
      type: "BUILD",
      state: "NODE_SPACE",
      vector: { origin: { x: 1, y: 9 }, target: { x: 1, y: 9 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE",
      vector: { origin: { x: 1, y: 10 }, target: { x: 1, y: 17 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 1, y: 18 }, target: { x: 1, y: 18 } },
    },
    { type: "INJECT", index: 1, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 2, y: 0 }, target: { x: 2, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 2, y: 1 }, target: { x: 2, y: 4 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 2, y: 5 }, target: { x: 2, y: 5 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 2, y: 6 }, target: { x: 2, y: 8 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 2, y: 9 }, target: { x: 2, y: 9 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 2, y: 10 }, target: { x: 2, y: 10 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 2, y: 11 }, target: { x: 2, y: 14 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 2, y: 15 }, target: { x: 2, y: 15 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 2, y: 16 }, target: { x: 2, y: 20 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 2, y: 21 }, target: { x: 2, y: 21 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 2, y: 22 }, target: { x: 2, y: 24 } },
    },
    {
      type: "BUILD",
      state: "NODE_SPACE",
      vector: { origin: { x: 2, y: 25 }, target: { x: 2, y: 25 } },
    },
    { type: "INJECT", index: 2, state: "ATTRIBUTE_INJECTION_MAP" },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 3, y: 0 }, target: { x: 3, y: 0 } },
    },
    { type: "INJECT", index: 3, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 4, y: 0 }, target: { x: 4, y: 0 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 4, y: 1 }, target: { x: 4, y: 1 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 4, y: 2 }, target: { x: 4, y: 4 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 4, y: 5 }, target: { x: 4, y: 5 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 4, y: 6 }, target: { x: 4, y: 6 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 4, y: 7 }, target: { x: 4, y: 11 } },
    },
    {
      type: "BUILD",
      state: "NODE_SPACE",
      vector: { origin: { x: 4, y: 12 }, target: { x: 4, y: 12 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE",
      vector: { origin: { x: 4, y: 13 }, target: { x: 4, y: 21 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_SETTER",
      vector: { origin: { x: 4, y: 22 }, target: { x: 4, y: 22 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_DECLARATION",
      vector: { origin: { x: 4, y: 23 }, target: { x: 4, y: 23 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_VALUE",
      vector: { origin: { x: 4, y: 24 }, target: { x: 4, y: 29 } },
    },
    {
      type: "BUILD",
      state: "ATTRIBUTE_DECLARATION_CLOSE",
      vector: { origin: { x: 4, y: 30 }, target: { x: 4, y: 30 } },
    },
    {
      type: "BUILD",
      state: "NODE_SPACE",
      vector: { origin: { x: 4, y: 31 }, target: { x: 4, y: 31 } },
    },
    {
      type: "BUILD",
      state: "INDEPENDENT_NODE",
      vector: { origin: { x: 4, y: 32 }, target: { x: 4, y: 32 } },
    },
    {
      type: "BUILD",
      state: "INDEPENDENT_NODE_CLOSED",
      vector: { origin: { x: 4, y: 33 }, target: { x: 4, y: 33 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 4, y: 34 }, target: { x: 4, y: 38 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 4, y: 39 }, target: { x: 4, y: 39 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 4, y: 40 }, target: { x: 4, y: 44 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 4, y: 45 }, target: { x: 4, y: 45 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 4, y: 46 }, target: { x: 4, y: 47 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 4, y: 48 }, target: { x: 4, y: 48 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 4, y: 49 }, target: { x: 4, y: 49 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 4, y: 50 }, target: { x: 4, y: 54 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 4, y: 55 }, target: { x: 4, y: 55 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 4, y: 56 }, target: { x: 4, y: 60 } },
    },
    { type: "INJECT", index: 4, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 5, y: 0 }, target: { x: 5, y: 3 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 5, y: 4 }, target: { x: 5, y: 4 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 5, y: 5 }, target: { x: 5, y: 5 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 5, y: 6 }, target: { x: 5, y: 9 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 5, y: 10 }, target: { x: 5, y: 10 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 5, y: 11 }, target: { x: 5, y: 13 } },
    },
    { type: "INJECT", index: 5, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 6, y: 0 }, target: { x: 6, y: 0 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseLinearInjectionsTest() {
  const assertions = [];
  const textVector = testTextInterpolator`${"a_head"}<a><b></b></a>${"a_tail"}`;
  const expectedResults = [
    {
      type: "BUILD",
      state: "INITIAL",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } },
    },
    { type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 2 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 3 }, target: { x: 1, y: 3 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME",
      vector: { origin: { x: 1, y: 4 }, target: { x: 1, y: 4 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSED",
      vector: { origin: { x: 1, y: 5 }, target: { x: 1, y: 5 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 6 }, target: { x: 1, y: 6 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 1, y: 7 }, target: { x: 1, y: 7 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 1, y: 8 }, target: { x: 1, y: 8 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 1, y: 9 }, target: { x: 1, y: 9 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 10 }, target: { x: 1, y: 10 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_SLASH",
      vector: { origin: { x: 1, y: 11 }, target: { x: 1, y: 11 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_TAGNAME",
      vector: { origin: { x: 1, y: 12 }, target: { x: 1, y: 12 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSED",
      vector: { origin: { x: 1, y: 13 }, target: { x: 1, y: 13 } },
    },
    { type: "INJECT", index: 1, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 2, y: 0 }, target: { x: 2, y: 0 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(textVector, stack);

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

const tests = [
  // nodes
  parseNodeTest,
  parseNodeWithImplicitAttributeTest,
  parseNodeWithImplicitAttributeWithSpacesTest,

  // independent nodes
  parseIndependentNodeTest,
  parseIndependentNodeWithImplicitAttributeTest,
  parseIndependentNodeWithImplicitAttributeWithSpacesTest,

  // explicit attributes
  parseExplicitAttributeTest,
  parseExplicitAttributeWithSpacesTest,

  // injections
  parseNodeInjectionsTest,
  parseNodeWithAttributeInjectionsTest,
  parseNodeWithAttributeInjectionsWithSpacesTest,
  parseNodeWithAttributeMultipleInjectionsWithSpacesTest,
  parseNodeWithAttributeMapInjectionsTest,

  // errors
  parseErrorTest,
  parseCloseNodeErrorTest,

  // fail safes
  parseEmptyTest,
  parseEmptyWithInjectionTest,
  parseEmptyWithMultipleInjectionsTest,

  // real world
  parseNestedTemplateWithInjectionsTest,
  parseLinearInjectionsTest,
];

const unitTestParse = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestParse };
