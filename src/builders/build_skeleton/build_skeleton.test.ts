// brian taylor vann
// build skeleton

// @ts-ignore - remote import
import { samestuff } from "https://github.com/taylor-vann/jackrabbit/blob/main/src/samestuff/samestuff.ts";

import { Template } from "../../type_flyweight/template.ts";
import { SkeletonNodes, buildSkeleton } from "./build_skeleton.ts";

type TextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const title = "build_skeleton";

const runTestsAsynchronously = true;

const testTextInterpolator: TextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const findNothingWhenThereIsPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 20 },
      },
    },
  ];

  const testBlank = testTextInterpolator`no nodes to be found!`;

  const testSkeleton = buildSkeleton(testBlank);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findStatementInPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 6 },
      },
    },
  ];

  const testOpenNode = testTextInterpolator`<hello>`;

  const testSkeleton = buildSkeleton(testOpenNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findComplexFromPlainText = () => {
  const assertions: string[] = [];
  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 4 },
      },
    },
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 5 },
        target: { arrayIndex: 0, stringIndex: 7 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 8 },
        target: { arrayIndex: 0, stringIndex: 12 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 13 },
        target: { arrayIndex: 0, stringIndex: 16 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`hello<p>world</p>`;

  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findCompoundFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 4 },
        target: { arrayIndex: 0, stringIndex: 8 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 9 },
        target: { arrayIndex: 0, stringIndex: 13 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`<h1>hello</h1>`;

  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findInjectionFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 4 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`<h1>${"hello"}</h1>`;

  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findPreceedingInjectionFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 2, stringIndex: 0 },
        target: { arrayIndex: 2, stringIndex: 4 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`${"hello"}<h1>${"hello"}</h1>`;

  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findTrailingInjectionFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 4 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 2, stringIndex: 0 },
        target: { arrayIndex: 2, stringIndex: 0 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`<h1>${"hello"}</h1>${"hello"}`;

  const testSkeleton = buildSkeleton(testComplexNode);
  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findMultipleInjectionFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 2, stringIndex: 0 },
        target: { arrayIndex: 2, stringIndex: 4 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 3, stringIndex: 0 },
        target: { arrayIndex: 3, stringIndex: 0 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`${"hello"}<h1>${"hello"}</h1>${"hello"}`;

  const testSkeleton = buildSkeleton(testComplexNode);
  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findBrokenFromPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 5 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 6 },
        target: { arrayIndex: 1, stringIndex: 10 },
      },
    },
    {
      nodeType: "OPEN_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 11 },
        target: { arrayIndex: 1, stringIndex: 13 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 14 },
        target: { arrayIndex: 1, stringIndex: 18 },
      },
    },
    {
      nodeType: "CLOSE_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 19 },
        target: { arrayIndex: 1, stringIndex: 22 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`<${"hello"}h2>hey</h2><p>howdy</p>`;

  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findSelfClosingNodesInOddPlainText = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 4 },
      },
    },
    {
      nodeType: "SELF_CLOSING_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 5 },
        target: { arrayIndex: 0, stringIndex: 10 },
      },
    },
    {
      nodeType: "SELF_CLOSING_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 11 },
        target: { arrayIndex: 0, stringIndex: 18 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 19,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 23,
        },
      },
    },
    {
      nodeType: "SELF_CLOSING_NODE_CONFIRMED",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 24 },
        target: { arrayIndex: 0, stringIndex: 33 },
      },
    },
    {
      nodeType: "CONTENT_NODE",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 11 },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`
    <dog/><doggo/>
    <puppers/>${"woof"}
    woof
  `;
  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const tests = [
  findInjectionFromPlainText,
  findNothingWhenThereIsPlainText,
  findStatementInPlainText,
  findComplexFromPlainText,
  findCompoundFromPlainText,
  findBrokenFromPlainText,
  findPreceedingInjectionFromPlainText,
  findTrailingInjectionFromPlainText,
  findMultipleInjectionFromPlainText,
  findSelfClosingNodesInOddPlainText,
];

const unitTestBuildSkeleton = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestBuildSkeleton };
