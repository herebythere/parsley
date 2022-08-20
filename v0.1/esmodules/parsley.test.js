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
        const rightNode = leftNode?.right;
        if (parentNode?.kind === "ELEMENT") {
            descendant.parent = parentNode;
        }
        descendant.left = leftNode;
        if (leftNode) {
            leftNode.right = descendant;
        }
        descendant.right = rightNode;
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
    "CLOSE_NODE",
    "CLOSE_INDEPENDENT_NODE",
    "CLOSE_NODE",
    "CLOSE_TAGNAME",
    "TEXT"
]);
const createFragment = ()=>{
    return {
        injections: [],
        references: new Map(),
        siblings: [],
        error: undefined
    };
};
const createStack = ()=>{
    return {
        nodes: [],
        node: undefined,
        attributeStep: undefined
    };
};
const pushNode = (hooks, rs, stack, step)=>{
    if (step.type !== "BUILD" || stack.node === undefined) return;
    const parentNodes = stack.nodes[stack.nodes.length - 2];
    const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];
    const rowNodes = stack.nodes[stack.nodes.length - 1];
    const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];
    hooks.insertDescendant(stack.node, parentNode, leftNode);
    const length = stack.nodes[stack.nodes.length - 1]?.push(stack.node);
    if (length === undefined) {
        stack.nodes.push([
            stack.node
        ]);
    }
    if (stack.nodes.length === 1) {
        rs.siblings.push(stack.node);
    }
    stack.node = undefined;
};
const createTextNode = (hooks, rs, stack, step)=>{
    if (step.type !== "BUILD") return;
    const parentNodes = stack.nodes[stack.nodes.length - 2];
    const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];
    const rowNodes = stack.nodes[stack.nodes.length - 1];
    const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];
    const descendant = hooks.createTextNode(step.value);
    hooks.insertDescendant(descendant, parentNode, leftNode);
    if (stack.nodes.length === 1) {
        rs.siblings.push(descendant);
    }
};
const setAttribute = (hooks, rs, stack, step)=>{
    if (stack?.node === undefined || stack?.attributeStep?.type !== "BUILD" || step?.type !== "BUILD") return;
    if (step.state === "SPACE_NODE" || step.state === "CLOSE_NODE") {
        console.log("setting attribute without value");
        hooks.setAttribute(stack.node, stack?.attributeStep?.value);
    }
    if (step.state === "ATTRIBUTE_VALUE") {
        hooks.setAttribute(stack.node, stack?.attributeStep.value, step.value);
    }
};
const popNode = (hooks, rs, stack, step)=>{
    const node = stack.nodes[stack.nodes.length - 1]?.pop();
    if (node === undefined) {
        stack.nodes.pop();
    }
};
const buildFragment = (hooks, reader, rs, stack)=>{
    reader.reset();
    let step = reader.next();
    while(step){
        if (step.type === "BUILD") {
            if (step.state === "TAGNAME") {
                stack.node = hooks.createNode(step.value);
            }
            if (step.state === "TEXT") {
                createTextNode(hooks, rs, stack, step);
            }
            if (step.state === "ATTRIBUTE") {
                stack.attributeStep = step;
            }
            if (stack.attributeStep && stack.node && (step.state === "SPACE_NODE" || step.state === "ATTRIBUTE_VALUE" || step.state === "CLOSE_NODE")) {
                setAttribute(hooks, rs, stack, step);
                stack.attributeStep = undefined;
            }
            if (step.state === "CLOSE_NODE") {
                pushNode(hooks, rs, stack, step);
            }
            if (step.state === "CLOSE_NODE_CLOSER" || step.state === "CLOSE_INDEPENDENT_CLOSE") {
                pushNode(hooks, rs, stack, step);
                popNode(hooks, rs, stack, step);
            }
        }
        if (step.type === "INJECT") {
            if (step.state === "ATTRIBUTE") {}
            if (step.state === "ATTRIBUTE_MAP") {}
            if (step.state === "DESCENDANT") {}
        }
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
            state: "SPACE_NODE",
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
            value: " "
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 12
                }
            },
            value: "howdy"
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            },
            value: ">"
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            },
            value: "yo!"
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            },
            value: "<"
        },
        {
            type: "BUILD",
            state: "NODE_CLOSER",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            },
            value: "/"
        },
        {
            type: "BUILD",
            state: "TAGNAME_CLOSE",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            },
            value: "hello"
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSER",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
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
    for (const node of fragment.siblings){
        console.log("node:", node, node.left, node.right);
    }
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
