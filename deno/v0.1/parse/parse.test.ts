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
		  state: "SPACE_NODE",
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
		  state: "SPACE_NODE",
		  vector: { origin: { x: 0, y: 6 }, target: { x: 0, y: 7 } }
		},
		{
		  type: "BUILD",
		  state: "ATTRIBUTE",
		  vector: { origin: { x: 0, y: 8 }, target: { x: 0, y: 16 } }
		},
		{
		  type: "BUILD",
		  state: "SPACE_NODE",
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

/*

const parseIndependentNodeTest = () => {
  const testVector = testTextInterpolator`<hello/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseIndependentNodeImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseIndependentNodeImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  />`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseExplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute="value"/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseExplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute="value"  />`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseNodeWithAttributeMapInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello ${"world"}/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseNodeWithInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello ${"world"}/>${"uwu"}</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseNodeWithAttributeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello world="${"world"}"/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseNodeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello>${"hi"}</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseerCommentTest = () => {
  const testVector = testTextInterpolator`<-- Hello world! -->`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

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
  // parseTest,
  
  parseNodeTest,
  parseNodeWithImplicitAttributeTest,
  parseNodeWithImplicitAttributeWithSpacesTest,
  
  /*
  parseerTest,
  parseerTest1,
  parseerTest2,
  parseerCommentTest,





  parseerCommentTest,

  parseIndependentNodeTest,
  parseIndependentNodeImplicitAttributeTest,
  parseIndependentNodeImplicitAttributeWithSpacesTest,

  parseExplicitAttributeTest,
  parseExplicitAttributeWithSpacesTest,

  parseNodeWithInjectionsTest,
  parseNodeWithAttributeMapInjectionsTest,
  parseNodeWithAttributeInjectionsTest,
  parseNodeInjectionsTest,

  parseerTextThenNodeTest,
  parseerTextThenNodeClosedTest,
  */
];

const unitTestParse = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestParse };
