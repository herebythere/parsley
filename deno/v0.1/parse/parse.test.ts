import type { Template } from "../type_flyweight/template.ts";
import type { Vector } from "../type_flyweight/text_vector.ts";

import { BuilderInterface, BuildStep } from "../type_flyweight/parse.ts";

import type { Delta } from "../type_flyweight/parse.ts";

import { parse } from "./parse.ts";

import { createFromTemplate } from "../text_vector/text_vector.ts";

// could just be an array
class TestBuilder implements BuilderInterface {
  builderStack: BuildStep[] = [];

  push(buildStep: BuildStep) {
    // console.log("state:", state);
    this.builderStack.push(buildStep);
  }
}

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

const parseTest = () => {
  const testVector = testTextInterpolator`<hello>hello ${"buster"}!</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);

  return ["fail!"];
};

const parseNodeTest = () => {
  const testVector = testTextInterpolator`<hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute>`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const parseImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  >`;

  console.log(testVector);

  const rb = new TestBuilder();
  parse(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

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

const tests = [
  parseTest,
  /*
  parseerTest,
  parseerTest1,
  parseerTest2,
  parseerCommentTest,

  parseNodeTest,
  parseImplicitAttributeTest,
  parseImplicitAttributeWithSpacesTest,

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
