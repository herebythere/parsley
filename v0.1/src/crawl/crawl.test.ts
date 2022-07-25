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
    crawlTest,
    crawlerTest,
    crawlerTest1,
    crawlerTest2,
    crawlerCommentTest
];

const unitTestCrawl = {
    title,
    tests,
    runTestsAsynchronously,
  };
  
  export { unitTestCrawl };
  