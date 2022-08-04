import type { Template } from "../type_flyweight/template.ts";

import { samestuff } from "../test_deps.ts";

import {crawl} from "./crawl.ts";

const title = "** crawl tests **"
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

// test no spaces ``
//  `${}`
//  `${}${}${}`


const crawlTest = () => {
    const testVector = testTextInterpolator`<hello>hello ${"buster"}!</hello>`;

    console.log(testVector);

    crawl(testVector);

    return ["fail!"];
}

const crawlNodeTest = () => {
  const testVector = testTextInterpolator`<hello>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}


const crawlImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  >`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlIndependentNodeTest = () => {
  const testVector = testTextInterpolator`<hello/>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlIndependentNodeImplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute/>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}


const crawlIndependentNodeImplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute  />`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}


const crawlExplicitAttributeTest = () => {
  const testVector = testTextInterpolator`<hello attribute="value"/>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}


const crawlExplicitAttributeWithSpacesTest = () => {
  const testVector = testTextInterpolator`<hello  attribute="value"  />`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlNodeWithAttributeMapInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello ${"world"}/>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlNodeWithAttributeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello world="${"world"}"/>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}
const crawlNodeInjectionsTest = () => {
  const testVector = testTextInterpolator`<hello>${"hi"}</hello>`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlerCommentTest = () => {
  const testVector = testTextInterpolator`<-- Hello world! -->`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlerTest = () => {
  const testVector = testTextInterpolator``;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlerTest1 = () => {
  const testVector = testTextInterpolator`${"buster"}`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const crawlerTest2 = () => {
  const testVector = testTextInterpolator`${"yo"}${"buddy"}${"boi"}`;

  console.log(testVector);

  crawl(testVector);

  return ["fail!"];
}

const tests = [
    // crawlTest,
    // crawlerTest,
    // crawlerTest1,
    // crawlerTest2,
    // crawlerCommentTest,

    // crawlNodeTest,
    // crawlImplicitAttributeTest,
    // crawlImplicitAttributeWithSpacesTest,

    // crawlIndependentNodeTest,
    // crawlIndependentNodeImplicitAttributeTest,
    // crawlIndependentNodeImplicitAttributeWithSpacesTest,

    // crawlExplicitAttributeTest,
    // crawlExplicitAttributeWithSpacesTest,

    crawlNodeWithAttributeMapInjectionsTest,
    crawlNodeWithAttributeInjectionsTest, 
    crawlNodeInjectionsTest,
];

const unitTestCrawl = {
    title,
    tests,
    runTestsAsynchronously,
  };
  
  export { unitTestCrawl };
  