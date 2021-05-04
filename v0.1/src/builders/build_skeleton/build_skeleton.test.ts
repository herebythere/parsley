// brian taylor vann
// build skeleton

import type { Template } from "../../type_flyweight/template.ts";
import type { SkeletonNodes } from "./build_skeleton.ts";

import { samestuff } from "../../test_deps.ts";
import { buildSkeleton } from "./build_skeleton.ts";

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
      nodeType: "CONTENT",
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
      nodeType: "OPENED_FOUND",
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
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 4 },
      },
    },
    {
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 5 },
        target: { arrayIndex: 0, stringIndex: 7 },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 8 },
        target: { arrayIndex: 0, stringIndex: 12 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
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
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 4 },
        target: { arrayIndex: 0, stringIndex: 8 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
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
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
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
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
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
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 4 },
      },
    },
    {
      nodeType: "CONTENT",
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
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 3 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
      vector: {
        origin: { arrayIndex: 2, stringIndex: 0 },
        target: { arrayIndex: 2, stringIndex: 4 },
      },
    },
    {
      nodeType: "CONTENT",
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
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 1, stringIndex: 5 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 6 },
        target: { arrayIndex: 1, stringIndex: 10 },
      },
    },
    {
      nodeType: "OPENED_FOUND",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 11 },
        target: { arrayIndex: 1, stringIndex: 13 },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 1, stringIndex: 14 },
        target: { arrayIndex: 1, stringIndex: 18 },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
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
      nodeType: "CONTENT",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 4 },
      },
    },
    {
      nodeType: "INDEPENDENT_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 5 },
        target: { arrayIndex: 0, stringIndex: 10 },
      },
    },
    {
      nodeType: "INDEPENDENT_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 11 },
        target: { arrayIndex: 0, stringIndex: 18 },
      },
    },
    {
      nodeType: "CONTENT",
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
      nodeType: "INDEPENDENT_FOUND",
      vector: {
        origin: { arrayIndex: 0, stringIndex: 24 },
        target: { arrayIndex: 0, stringIndex: 33 },
      },
    },
    {
      nodeType: "CONTENT",
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

const findOneCharacterDescendants = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [
    {
      nodeType: "CONTENT",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 0,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 4,
        },
      },
    },
    {
      nodeType: "OPENED_FOUND",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 5,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 7,
        },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 8,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 21,
        },
      },
    },
    {
      nodeType: "OPENED_FOUND",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 22,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 82,
        },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 83,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 87,
        },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 88,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 91,
        },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 92,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 97,
        },
      },
    },
    {
      nodeType: "CLOSED_FOUND",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 98,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 101,
        },
      },
    },
    {
      nodeType: "CONTENT",
      vector: {
        origin: {
          arrayIndex: 0,
          stringIndex: 102,
        },
        target: {
          arrayIndex: 0,
          stringIndex: 104,
        },
      },
    },
  ];

  const testComplexNode = testTextInterpolator`
    <p>
      hello, <a href="http://superawesome.com/" alt="\"superawesome.com\"" >world</a>!
    </p>
  `;
  const testSkeleton = buildSkeleton(testComplexNode);

  if (!samestuff(sourceSkeleton, testSkeleton)) {
    assertions.push("skeletons are not equal");
  }

  return assertions;
};

const findOpenNodeWithInjected = () => {
  const assertions: string[] = [];

  const sourceSkeleton: SkeletonNodes = [{
		"nodeType": "OPENED_FOUND",
		"vector": {
			"origin": {
				"arrayIndex": 0,
				"stringIndex": 0
			},
			"target": {
				"arrayIndex": 1,
				"stringIndex": 1
			}
		}
	}];

  const testComplexNode = testTextInterpolator`<p message="${"hello, world!"}">`;
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
  findOneCharacterDescendants,
	findOpenNodeWithInjected
];

const unitTestBuildSkeleton = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestBuildSkeleton };
