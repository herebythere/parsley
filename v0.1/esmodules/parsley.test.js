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
new Set([
    "TAGNAME",
    "ATTRIBUTE_VALUE",
    "ATTRIBUTE",
    "NODE_CLOSE",
    "CLOSE_INDEPENDENT_NODE",
    "CLOSE_NODE",
    "CLOSE_TAGNAME",
    "TEXT"
]);
const createFragment = ()=>{
    return {
        injections: [],
        references: new Map(),
        siblings: []
    };
};
const createStack = ()=>{
    return {
        nodes: [],
        node: undefined,
        attributeStep: undefined
    };
};
const createNode = (hooks, rs, stack, step)=>{
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
    const length = stack.nodes[stack.nodes.length - 1]?.push(descendant);
    if (length === undefined) {
        stack.nodes.push([
            descendant
        ]);
    }
    if (stack.nodes.length === 1) {
        rs.siblings.push(descendant);
    }
};
const buildFragment = (hooks, reader, rs, stack)=>{
    reader.reset();
    let step = reader.next();
    while(step){
        console.log("step:", step);
        if (step.type === "BUILD") {
            if (step.state === "TAGNAME") {
                console.log("build node:");
                createNode(hooks, rs, stack, step);
            }
        }
        if (step.type === "INJECT") {}
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
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
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
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            },
            value: ">"
        }
    ]);
    const fragment = createFragment();
    const stack = createStack();
    buildFragment(hooks, reader, fragment, stack);
    console.log("fragment:", fragment);
    console.log("stack:", stack);
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
