// brian taylor vann
// build render

// import type { Integrals } from "../../type_flyweight/integrals.ts";
// import type {
//   AttributeValue,
//   Template,
// } from "../type_flyweight/template.ts";
import { TestNode } from "../test_hooks/test_element.ts";
// // import type { Chunker } from "../type_flyweight/chunker.ts";

// // import { buildIntegrals } from "../build_integrals/build_integrals.ts";
// import { buildRender } from "./structure.ts";
// // import { buildSkeleton } from "../build_skeleton/build_skeleton.ts";
// // import { Chunk } from "../chunk/chunk.ts";
import { draw, hooks, TestAttributes } from "../test_hooks/test_hooks.ts";

// interface InterpolatorResults<N, A> {
//   template: Template<N, A>;
//   integrals: Integrals;
// }
// type TextTextInterpolator<N, A, P, S> = (
//   templateArray: TemplateStringsArray,
//   ...injections: AttributeValue<N, A>[]
// ) => InterpolatorResults<N, A>;

import type { BuildStep } from "../type_flyweight/parse.ts";
import type {ReaderInterface} from "./fragment.ts";
import {buildFragment, createFragment, createStack} from "./fragment.ts";

const title = "build_render";
const runTestsAsynchronously = true;

// const testTextInterpolator: TextTextInterpolator<
//   TestNode,
//   TestAttributes,
//   Record<string, string>,
//   unknown
// > = (templateArray, ...injections) => {
//   const template = { templateArray, injections };
//   const params = {
//     skeleton: buildSkeleton(template),
//     template,
//   };

//   return {
//     template,
//     integrals: buildIntegrals(params),
//   };
// };

class TestReader implements ReaderInterface {
    index: number = -1
    steps: BuildStep[];

    constructor(steps: BuildStep[]) {
        this.steps = steps
    }

    next() {
        this.index += 1;
        return this.steps[this.index];
    }

    reset() {
        this.index = -1;
    }
}

const testCreateNode = () => {
    const assertions: string[] = ["fail"];

    const reader = new TestReader([
        {
            type: "BUILD",
            state: "NODE",
            vector: {origin: {x: 0, y: 0}, target: {x: 0, y: 0}},
            value: "<"
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {origin: {x: 0, y: 1}, target: {x: 0, y: 5}},
            value: "hello",
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE",
            vector: {origin: {x: 0, y: 6}, target: {x: 0, y: 6}},
            value: ">"
        }
    ]);

    const fragment = createFragment<TestNode, string>();
    const stack = createStack<TestNode, string>();
    buildFragment<TestNode, string>(
        hooks,
        reader,
        fragment,
        stack,
    );

    console.log(fragment);

    return assertions;
};



const tests = [
    testCreateNode,
    // testCloseNode,
    // testTextNode,
    // testAddAttributesToNodes,
    // testAddAttributesToMultipleNodes,
    // testAddContext,
    // testBuildingCachedIntegrals,
];

const unitTestBuildFragment = {
    title,
    tests,
    runTestsAsynchronously,
};

export { unitTestBuildFragment };
