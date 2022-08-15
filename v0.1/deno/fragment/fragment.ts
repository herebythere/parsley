// create a fragment

// get a reader
// use a builder
//

// enqueue a node
// add attribute
// add add attribute value
// pop node
// 
// enqueue a set of children
// retain the top and left node

// stack queue
//

// brian taylor vann
// build render

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { RenderStructure, Stack } from "../type_flyweight/fragment.ts";

import { BuildStep } from "../type_flyweight/parse.ts";

interface ReaderInterface {
    next(): BuildStep | undefined;
    reset(): void;
}

type BuildFragment = <N, A>(
    hooks: Hooks<N, A>,
    reader: ReaderInterface,
    renderStructure: RenderStructure<N, A>,
    stack: Stack<N>,
) => void;

type BuildHelper = <N, A>(
    hooks: Hooks<N, A>,
    rs: RenderStructure<N, A>,
    stack: Stack<N>,
    step: BuildStep,
) => void;

type BuildHelperNoHooks = <N, A>(
    rs: RenderStructure<N, A>,
    stack: Stack<N>,
    step: BuildStep,
) => void;

// Separate render from build

// if not big enough for memory it will be a write driven process
// get build steps -> write build steps to file
// read build steps -> get build steps one line at a time
//
// structure builder becomes about steps
// next() next next until undefined
// reset() -> 0 index mark

// stack push pop

//
const fragmentSet = new Set([
    // node and attributes
    "TAGNAME",
    "ATTRIBUTE_VALUE",
    "ATTRIBUTE",
    "NODE_CLOSE",
    "CLOSE_INDEPENDENT_NODE",

    // pop node
    "CLOSE_NODE",
    "CLOSE_TAGNAME",
    "TEXT"
]);

const createFragment = <N, A>(): RenderStructure<N, A> => {
    return {
        injections: [],
        references: new Map(),
        siblings: [],
    };
}

const createStack = <N>(): Stack<N> => {
    return {
        nodes: [],
        node: undefined,
        attributeStep: undefined,
    };
}

const createNode: BuildHelper = (hooks, rs, stack, step) => {
    if (step.type !== "BUILD") return;
    console.log("createNode:");

    const parentNodes = stack.nodes[stack.nodes.length - 2];
    const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];

    const rowNodes = stack.nodes[stack.nodes.length - 1];
    const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];
    const descendant = hooks.createNode(step.value);

    console.log(parentNodes);
    console.log(rowNodes);
    console.log(parentNode, leftNode, descendant);
    hooks.insertDescendant(descendant, parentNode, leftNode);

    const length = stack.nodes[stack.nodes.length - 1]?.push(descendant)
    if (length === undefined) {
        stack.nodes.push([descendant]);
    }
    if (stack.nodes.length === 1) {
        rs.siblings.push(descendant);
    }
};

// const closeNode: BuildHelperNoHooks = (rs, stack, step) => {
//     if (step.type !== "BUILD") return;

//     const rowNodes = stack[stack.length - 1];
//     if (!rowNodes?.pop()) {
//         stack.pop();
//     }
// };

// const createTextNode: BuildHelper = (hooks, rs, stack, step) => {
//     if (step.type !== "BUILD") return;
//     const text = step.value;
//     if (text === undefined) return;

//     const parentNodes = stack[stack.length - 2];
//     const parentNode = parentNodes?.[(parentNodes?.length ?? 1) - 1];

//     const rowNodes = stack[stack.length - 1];
//     const leftNode = rowNodes?.[(rowNodes?.length ?? 1) - 1];
//     const descendant = hooks.createTextNode(text);

//     rowNodes?.push(descendant);
//     hooks.insertDescendant(descendant, parentNode, leftNode);
// };

// only need parent[][]

const buildFragment: BuildFragment = (hooks, reader, rs, stack) => {
    // also go by two stepping and deltas
    reader.reset();

    // map to keep track of what kinds we want
    //
    // prevStep is only the last concerned

    let step = reader.next()
    while (step) {
        console.log("step:", step);

        // TEXT
        //

        // TAGNAME
        //
        if (step.type === "BUILD") {
            if (step.state === "TAGNAME") {
                console.log("build node:");
                createNode(hooks, rs, stack, step);
            }

            // ATTRIBUTE
            //  set attribute name in stack
            //

            // ATTRIBUTE_VALUE
            //  add attribute value to node
            //  set attribute and attribute value to undefined

            // NODE_CLOSE
            //   if attribute but not attribute value
            //     set attribute and attribute value to undefined
            //
        }

        if (step.type === "INJECT") {

            // ATTRIBUTE INJECITON
            //   add to injecitons
            //

            // ATTRIBUTE MAP INJECITON
            //   add to injecitons
            //

            // 
            // if (step.state === "CHUNK_INJECTION") {
            //   createChunkArrayInjection(hooks, rs, step);
            // }
        }

        step = reader.next()
    }
};

export type { ReaderInterface }

export {
    buildFragment,
    createFragment,
    createStack,
};
