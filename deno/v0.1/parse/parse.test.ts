import type { Template } from "../type_flyweight/template.ts";
import type { Vector } from "../type_flyweight/text_vector.ts";

import { BuilderInterface, BuildStep } from "../type_flyweight/parse.ts";

import type { Delta } from "../type_flyweight/parse.ts";

import { crawl } from "./parse.ts";

import { createFromTemplate } from "../text_vector/text_vector.ts";

class TestBuilder implements BuilderInterface {
  builderStack: BuildStep[] = [];

  push(buildStep: BuildStep) {
    // console.log("state:", state);
    this.builderStack.push(buildStep);
  }
}

const INITIAL = "INITIAL";

const title = "** crawl tests **";
const runTestsAsynchronously = true;

type TextTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

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

const crawlTest = () => {
  const testVector = testTextInterpolator`<hello>hello ${"buster"}!</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);

  return ["fail!"];
};

const crawlNodeTest = () => {
  const testVector = testTextInterpolator`<hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  >`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlIndependentNodeTest = () => {
  const testVector = testTextInterpolator`<hello/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlIndependentNodeImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlIndependentNodeImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  />`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlExplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute="value"/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlExplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute="value"  />`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

// const crawlNodeWithAttributeMapInjectionsTest = () => {
//   const testVector = testTextInterpolator`<hello ${"world"}/>`;

//   console.log(testVector);

//   const rb = new TestBuilder();
//   crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
//   console.log(rb.builderStack);;
//   return ["fail!"];
// }

const crawlNodeWithInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello ${"world"}/>${"uwu"}</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlNodeWithAttributeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello world="${"world"}"/>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlNodeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello>${"hi"}</hello>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlerCommentTest = () => {
  const testVector = testTextInterpolator`<-- Hello world! -->`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlerTextThenNodeTest = () => {
  const testVector = testTextInterpolator`<Z<hello <howdy>`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb);
  return ["fail!"];
};

const crawlerTextThenNodeClosedTest = () => {
  const testVector = testTextInterpolator`<howdy> </ dfsdf </howdy?`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlerTest = () => {
  const testVector = testTextInterpolator``;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlerTest1 = () => {
  const testVector = testTextInterpolator`${"buster"}`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const crawlerTest2 = () => {
  const testVector = testTextInterpolator`${"yo"}${"buddy"}${"boi"}`;

  console.log(testVector);

  const rb = new TestBuilder();
  crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
  console.log(rb.builderStack);
  return ["fail!"];
};

const tests = [
  crawlTest,
  // crawlerTest,
  // crawlerTest1,
  // crawlerTest2,
  // crawlerCommentTest,

  // crawlNodeTest,
  // crawlImplicitAttributeTest,
  // crawlImplicitAttributeWithSpacesTest,

  // crawlerCommentTest,

  // crawlIndependentNodeTest,
  // crawlIndependentNodeImplicitAttributeTest,
  // crawlIndependentNodeImplicitAttributeWithSpacesTest,

  // crawlExplicitAttributeTest,
  // crawlExplicitAttributeWithSpacesTest,

  crawlNodeWithInjectionsTest,
  // crawlNodeWithAttributeMapInjectionsTest,
  // crawlNodeWithAttributeInjectionsTest,
  // crawlNodeInjectionsTest,

  // crawlerTextThenNodeTest,
  // crawlerTextThenNodeClosedTest,
];

const unitTestCrawl = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestCrawl };
