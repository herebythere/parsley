// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const hooks = {
    createNode: (tagname)=>{
        return {
            kind: "ELEMENT",
            attributes: {},
            tagname
        };
    },
    createTextNode: (text)=>{
        return {
            kind: "TEXT",
            text
        };
    },
    setAttribute: (node, attribute, value)=>{
        if (node.kind === "ELEMENT") {
            node.attributes[attribute] = value;
        }
    },
    removeAttribute: (node, attribute)=>{
        if (node.kind === "ELEMENT") {
            node.attributes[attribute] = undefined;
        }
    },
    getSiblings: (sibling)=>{
        return [
            sibling.left,
            sibling.right
        ];
    },
    insertDescendant: (descendant, parentNode, leftNode)=>{
        if (leftNode !== undefined) {
            const leftRightDescendant = leftNode.right;
            descendant.right = leftRightDescendant;
            if (leftRightDescendant !== undefined) {
                leftRightDescendant.left = descendant;
            }
            descendant.left = leftNode;
            leftNode.right = descendant;
        }
        if (parentNode?.kind === "ELEMENT") {
            descendant.parent = parentNode;
            if (parentNode.leftChild === undefined) {
                parentNode.leftChild = descendant;
            }
            if (parentNode.rightChild === leftNode) {
                parentNode.rightChild = descendant;
            }
        }
    },
    removeDescendant: (descendant)=>{
        const parent = descendant.parent;
        const leftNode = descendant.left;
        const rightNode = descendant.right;
        descendant.parent = undefined;
        descendant.right = undefined;
        descendant.left = undefined;
        if (leftNode !== undefined) {
            leftNode.right = rightNode;
        }
        if (rightNode !== undefined) {
            rightNode.left = leftNode;
        }
        if (parent === undefined) {
            return;
        }
        if (descendant === parent.leftChild) {
            parent.leftChild = rightNode;
        }
        if (descendant === parent.rightChild) {
            parent.rightChild = leftNode;
        }
        return parent;
    }
};
const createFragment = ()=>{
    return {
        injections: [],
        references: new Map(),
        siblings: []
    };
};
const createNode = (hooks, rs, stack, step)=>{
    if (step.type !== "BUILD") return;
    console.log("createNode:", step);
    const tagName = step.value;
    const parentNodes = stack[stack.length - 2];
    const parentNode = parentNodes?.[(parentNodes?.length - 1) ?? 0];
    const rowNodes = stack[stack.length - 1];
    const leftNode = rowNodes?.[(rowNodes?.length - 1) ?? 0];
    const descendant = hooks.createNode(tagName);
    if (stack.length < 1) {
        rs.siblings.push(descendant);
    }
    stack.push([
        descendant
    ]);
    hooks.insertDescendant(descendant, parentNode, leftNode);
};
const closeNode = (rs, stack, step)=>{
    if (step.type !== "BUILD") return;
    const rowNodes = stack[stack.length - 1];
    if (!rowNodes?.pop()) {
        stack.pop();
    }
};
const createTextNode = (hooks, rs, stack, step)=>{
    if (step.type !== "BUILD") return;
    const text = step.value;
    if (text === undefined) return;
    const parentNodes = stack[stack.length - 2];
    const parentNode = parentNodes?.[(parentNodes?.length ?? 1) - 1];
    const rowNodes = stack[stack.length - 1];
    const leftNode = rowNodes?.[(rowNodes?.length ?? 1) - 1];
    const descendant = hooks.createTextNode(text);
    rowNodes?.push(descendant);
    hooks.insertDescendant(descendant, parentNode, leftNode);
};
const buildFragment = (hooks, reader, rs = createFragment(), stack = [])=>{
    reader.reset();
    let prevStep = reader.next();
    let step = reader.next();
    while(prevStep && step){
        console.log("step:", prevStep);
        if (prevStep.type === "BUILD") {
            if (prevStep.state === "NODE") {
                console.log("build node:");
                createNode(hooks, rs, stack, prevStep);
            }
            if (prevStep.state === "CLOSE_NODE" || prevStep.state === "CLOSE_INDEPENDENT_NODE") {
                closeNode(rs, stack, prevStep);
            }
            if (prevStep.state === "TEXT") {
                createTextNode(hooks, rs, stack, prevStep);
            }
        }
        if (prevStep.type === "INJECT") {}
        prevStep = step;
        step = reader.next();
    }
};
const title = "build_render";
class TestReader {
    index = -1;
    steps;
    constructor(steps){
        this.steps = steps;
    }
    next() {
        this.index += 1;
        return this.steps[this.index];
    }
    reset() {
        this.index = -1;
    }
}
const testCreateNode = ()=>{
    const assertions = [
        "fail"
    ];
    const reader = new TestReader([
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            },
            value: "<"
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            },
            value: "hello"
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            },
            value: ">"
        }
    ]);
    const fragment = createFragment();
    buildFragment(hooks, reader, fragment);
    console.log(fragment);
    return assertions;
};
const tests = [
    testCreateNode, 
];
const unitTestBuildFragment = {
    title,
    tests,
    runTestsAsynchronously: true
};
const tests1 = [
    unitTestBuildFragment, 
];
export { tests1 as tests };
