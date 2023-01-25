import type { Template } from "../type_flyweight/template.ts";
import type { Vector } from "../type_flyweight/text_vector.ts";
import type { BuilderInterface, BuildStep } from "../type_flyweight/parse.ts";
import type { Delta } from "../type_flyweight/parse.ts";

import { parse } from "./parse.ts";
import { samestuff } from "../test_deps.ts";
import { createFromTemplate } from "../text_vector/text_vector.ts";


const INITIAL = "INITIAL";

const title = "** parse tests **";
const runTestsAsynchronously = true;

type TextTextInterpolator = <I>(
  templateArray: TemplateStringsArray,
  ...injections: I[]
) => Template<I>;

const testTextInterpolator: TextTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

function createDelta(vector: Vector): Delta {
  return {
    prevPos: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
    vector,
    prevState: INITIAL,
    state: INITIAL,
  };
}

/*
const parseTest = () => {
  const assertions = [];
  const testVector = testTextInterpolator`<hello>hello ${"buster"}!</hello>`;

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
      state: "CLOSE_NODE",
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 12 } },
    },
    { type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
    {
      type: "BUILD",
      state: "TEXT",
      vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } },
    },
    {
      type: "BUILD",
      state: "NODE",
      vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } },
    },
    {
      type: "BUILD",
      state: "NODE_CLOSER",
      vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 2 } },
    },
    {
      type: "BUILD",
      state: "TAGNAME_CLOSE",
      vector: { origin: { x: 1, y: 3 }, target: { x: 1, y: 7 } },
    },
    {
      type: "BUILD",
      state: "CLOSE_NODE_CLOSER",
      vector: { origin: { x: 1, y: 8 }, target: { x: 1, y: 8 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};
*/

function parseNodeTest() {
  const assertions = [];
  const testVector = testTextInterpolator`<hello>`;
  const expectedResults = [
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
      state: "CLOSE_NODE",
      vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } },
    },
  ];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
}

function parseNodeWithImplicitAttributeTest() {
	const assertions = []
  const testVector = testTextInterpolator`<hello attribute>`;
  const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
  
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseNodeWithImplicitAttributeWithSpacesTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello  attribute  >`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 18 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 19 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseIndependentNodeTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello/>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 7 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
  
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parseIndependentNodeWithImplicitAttributeTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`<hello attribute/>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseIndependentNodeWithImplicitAttributeWithSpacesTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello  attribute  />`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 18 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 19 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 20 }, target: { x: 0, y: 20 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parseExplicitAttributeTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`<hello attribute="value"/>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 15 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_SETTER",
		  vector: { origin: { x: 0, y: 16 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_VALUE",
		  vector: { origin: { x: 0, y: 18 }, target: { x: 0, y: 22 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 0, y: 23 }, target: { x: 0, y: 23 } }
		},
		// independent node closer
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 24 }, target: { x: 0, y: 24 } }
		},
		// close independent node
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 25 }, target: { x: 0, y: 25 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseExplicitAttributeWithSpacesTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello  attribute="value"  />`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_SETTER",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 0, y: 18 }, target: { x: 0, y: 18 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_VALUE",
		  vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 23 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 0, y: 24 }, target: { x: 0, y: 24 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 25 }, target: { x: 0, y: 26 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 27 }, target: { x: 0, y: 27 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 0, y: 28 }, target: { x: 0, y: 28 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseNodeInjectionsTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello>${"hi"}</hello>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{ type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_CLOSER",
		  vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME_CLOSE",
		  vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE_CLOSER",
		  vector: { origin: { x: 1, y: 7 }, target: { x: 1, y: 7 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parseNodeWithAttributeInjectionsTest() {
	const assertions = [];
  const testVector = testTextInterpolator`<hello world="${"world"}"/>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 7 }, target: { x: 0, y: 11 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_SETTER",
		  vector: { origin: { x: 0, y: 12 }, target: { x: 0, y: 12 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 0, y: 13 }, target: { x: 0, y: 13 } }
		},
		{ type: "INJECT", index: 0, state: "ATTRIBUTE_INJECTION" },
		{
		  type: "BUILD",
		  state: "CLOSE_ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 1, y: 2 }, target: { x: 1, y: 2 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parseNodeWithAttributeMapInjectionsTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`<hello ${"world"}/>`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 6 } }
		},
		{ type: "INJECT", index: 0, state: "ATTRIBUTE_INJECTION_MAP" },
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 1, y: 1 }, target: { x: 1, y: 1 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parserCommentTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`<-- Hello world! -->`;
	const expectedResults: BuildStep[] = [
		{
		  type: "BUILD",
		  state: "INITIAL",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "COMMENT_0",
		  vector: { origin: { x: 0, y: 1 }, target: { x: 0, y: 1 } }
		},
		{
		  type: "BUILD",
		  state: "COMMENT_1",
		  vector: { origin: { x: 0, y: 2 }, target: { x: 0, y: 2 } }
		},
		{
		  type: "BUILD",
		  state: "COMMENT",
		  vector: { origin: { x: 0, y: 3 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "COMMENT_CLOSE",
		  vector: { origin: { x: 0, y: 17 }, target: { x: 0, y: 17 } }
		},
		{
		  type: "BUILD",
		  state: "COMMENT_CLOSE_1",
		  vector: { origin: { x: 0, y: 18 }, target: { x: 0, y: 18 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 0, y: 19 }, target: { x: 0, y: 19 } }
		}
	];

  const stack: BuildStep[] = [];
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));

  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

function parserEmptyTest() {
	const assertions = [];
  const testVector = testTextInterpolator``;
  const expectedResults: BuildStep[] = [];

  const stack: BuildStep[] = [];
  
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
	console.log(stack);
	// this is wrong, should give us something but we got nothing
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parserEmptyWithInjectionTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`${"buster"}`;
  const expectedResults: BuildStep[] = [
  	{ type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" }
  ];
  // console.log(testVector);

	// this is wrong
	// should give us an injection step
  const stack: BuildStep[] = [];
  
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
	console.log(stack);
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parserEmptyWithMultipleInjectionsTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`${"yo"}${"buddy"}${"boi"}`;
  const expectedResults: BuildStep[] = [
		{ type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
		{ type: "INJECT", index: 1, state: "DESCENDANT_INJECTION" },
		{ type: "INJECT", index: 2, state: "DESCENDANT_INJECTION" }
	];
  
  // console.log(testVector);

  const stack: BuildStep[] = [];
  // this is wrong
  // should give some kind of feedback
  
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
	// console.log(stack);
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

const parserNestedTemplateWithInjectionsTest = () => {
	const assertions = [];
  const testVector = testTextInterpolator`${"stardust"}
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
		  vector: { origin: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
		},
		{ type: "INJECT", index: 0, state: "DESCENDANT_INJECTION" },
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 1, y: 0 }, target: { x: 1, y: 3 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 1, y: 4 }, target: { x: 1, y: 4 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 1, y: 5 }, target: { x: 1, y: 8 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 1, y: 9 }, target: { x: 1, y: 9 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 1, y: 10 }, target: { x: 1, y: 17 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 1, y: 18 }, target: { x: 1, y: 18 } }
		},
		{ type: "INJECT", index: 1, state: "DESCENDANT_INJECTION" },
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 2, y: 0 }, target: { x: 2, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 2, y: 1 }, target: { x: 2, y: 4 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 2, y: 5 }, target: { x: 2, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 2, y: 6 }, target: { x: 2, y: 8 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 2, y: 9 }, target: { x: 2, y: 9 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_CLOSER",
		  vector: { origin: { x: 2, y: 10 }, target: { x: 2, y: 10 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME_CLOSE",
		  vector: { origin: { x: 2, y: 11 }, target: { x: 2, y: 14 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE_CLOSER",
		  vector: { origin: { x: 2, y: 15 }, target: { x: 2, y: 15 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 2, y: 16 }, target: { x: 2, y: 20 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 2, y: 21 }, target: { x: 2, y: 21 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 2, y: 22 }, target: { x: 2, y: 24 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 2, y: 25 }, target: { x: 2, y: 25 } }
		},
		{ type: "INJECT", index: 2, state: "ATTRIBUTE_INJECTION_MAP" },
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 3, y: 0 }, target: { x: 3, y: 0 } }
		},
		{ type: "INJECT", index: 3, state: "DESCENDANT_INJECTION" },
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 4, y: 0 }, target: { x: 4, y: 0 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_CLOSER",
		  vector: { origin: { x: 4, y: 1 }, target: { x: 4, y: 1 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME_CLOSE",
		  vector: { origin: { x: 4, y: 2 }, target: { x: 4, y: 4 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE_CLOSER",
		  vector: { origin: { x: 4, y: 5 }, target: { x: 4, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 4, y: 6 }, target: { x: 4, y: 6 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 4, y: 7 }, target: { x: 4, y: 11 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 4, y: 12 }, target: { x: 4, y: 12 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 4, y: 13 }, target: { x: 4, y: 21 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_SETTER",
		  vector: { origin: { x: 4, y: 22 }, target: { x: 4, y: 22 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 4, y: 23 }, target: { x: 4, y: 23 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE_VALUE",
		  vector: { origin: { x: 4, y: 24 }, target: { x: 4, y: 29 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_ATTRIBUTE_DECLARATION",
		  vector: { origin: { x: 4, y: 30 }, target: { x: 4, y: 30 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_SPACE",
		  vector: { origin: { x: 4, y: 31 }, target: { x: 4, y: 31 } }
		},
		{
		  type: "BUILD",
		  state: "INDEPENDENT_NODE",
		  vector: { origin: { x: 4, y: 32 }, target: { x: 4, y: 32 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_INDEPENDENT_NODE",
		  vector: { origin: { x: 4, y: 33 }, target: { x: 4, y: 33 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 4, y: 34 }, target: { x: 4, y: 38 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 4, y: 39 }, target: { x: 4, y: 39 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME",
		  vector: { origin: { x: 4, y: 40 }, target: { x: 4, y: 44 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE",
		  vector: { origin: { x: 4, y: 45 }, target: { x: 4, y: 45 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 4, y: 46 }, target: { x: 4, y: 47 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 4, y: 48 }, target: { x: 4, y: 48 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_CLOSER",
		  vector: { origin: { x: 4, y: 49 }, target: { x: 4, y: 49 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME_CLOSE",
		  vector: { origin: { x: 4, y: 50 }, target: { x: 4, y: 54 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE_CLOSER",
		  vector: { origin: { x: 4, y: 55 }, target: { x: 4, y: 55 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 4, y: 56 }, target: { x: 4, y: 60 } }
		},
		{ type: "INJECT", index: 4, state: "DESCENDANT_INJECTION" },
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 5, y: 0 }, target: { x: 5, y: 3 } }
		},
		{
		  type: "BUILD",
		  state: "NODE",
		  vector: { origin: { x: 5, y: 4 }, target: { x: 5, y: 4 } }
		},
		{
		  type: "BUILD",
		  state: "NODE_CLOSER",
		  vector: { origin: { x: 5, y: 5 }, target: { x: 5, y: 5 } }
		},
		{
		  type: "BUILD",
		  state: "TAGNAME_CLOSE",
		  vector: { origin: { x: 5, y: 6 }, target: { x: 5, y: 9 } }
		},
		{
		  type: "BUILD",
		  state: "CLOSE_NODE_CLOSER",
		  vector: { origin: { x: 5, y: 10 }, target: { x: 5, y: 10 } }
		},
		{
		  type: "BUILD",
		  state: "TEXT",
		  vector: { origin: { x: 5, y: 11 }, target: { x: 5, y: 13 } }
		},
		{ type: "INJECT", index: 5, state: "DESCENDANT_INJECTION" }
	];

  console.log(testVector);

  const stack: BuildStep[] = [];
  // this is wrong
  // should give some kind of feedback
  
  parse(testVector, stack, createDelta(createFromTemplate(testVector)));
	console.log(stack);
  if (!samestuff(expectedResults, stack)) {
    assertions.push("stack does not match expected results");
  }

  return assertions;
};

/*
const parseerTextThenNodeTest = () => {
  const testVector = testTextInterpolator`<Z<hello <howdy>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb);
  return ["fail!"];
};

const parseerTextThenNodeClosedTest = () => {
  const testVector = testTextInterpolator`<howdy> </ dfsdf </howdy?`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseerTest = () => {
  const testVector = testTextInterpolator``;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseerTest1 = () => {
  const testVector = testTextInterpolator`${"buster"}`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseerTest2 = () => {
  const testVector = testTextInterpolator`${"yo"}${"buddy"}${"boi"}`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

*/

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
  parseNodeWithAttributeMapInjectionsTest,

  // comments
  parserCommentTest,

  // fail safes
  // something complicated and nested
  //
  // these are failing (passing but shouldnt)
  // parserNestedTemplateWithInjectionsTest,

  parserEmptyTest,
  parserEmptyWithInjectionTest,
  parserEmptyWithMultipleInjectionsTest,
 
 	// yo yo big dawg test
  // failing
	// has to do with initial ${} injections
  parserNestedTemplateWithInjectionsTest,
];

const unitTestParse = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestParse };
