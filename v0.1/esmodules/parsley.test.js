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
const title = "test_hooks";
const testCreateNode = ()=>{
    const assertions = [];
    const node = hooks.createNode("hello");
    if (node === undefined) {
        assertions.push("node should not be undefined.");
    }
    if (node.kind !== "ELEMENT") {
        assertions.push("should create an ELEMENT");
    }
    if (node.kind === "ELEMENT" && node.tagname !== "hello") {
        assertions.push("tagname should be 'hello'");
    }
    return assertions;
};
const testCreateTextNode = ()=>{
    const assertions = [];
    const node = hooks.createTextNode("hello!");
    if (node === undefined) {
        assertions.push("text node should not be undefined.");
    }
    if (node.kind === "TEXT" && node.text !== "hello!") {
        assertions.push("text node should have 'hello!'");
    }
    return assertions;
};
const testSetAttribute = ()=>{
    const assertions = [];
    const node = hooks.createNode("basic");
    hooks.setAttribute(node, "checked", true);
    if (node.kind !== "ELEMENT") {
        assertions.push("node should be an ELEMENT");
    }
    if (node.kind === "ELEMENT" && node.attributes["checked"] !== true) {
        assertions.push("checked should be true.");
    }
    return assertions;
};
const testInsertDescendant = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant(starlight, sunshine);
    hooks.insertDescendant(moonbeam, sunshine, starlight);
    if (starlight.kind === "ELEMENT" && starlight.left !== undefined) {
        assertions.push("starlight should have no left sibling");
    }
    if (starlight.kind === "ELEMENT" && starlight.right !== moonbeam) {
        assertions.push("starlight should have moonbeam as a sibling");
    }
    if (moonbeam.kind === "ELEMENT" && starlight.parent !== sunshine) {
        assertions.push("starlight should have sunshin as a parent");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.left !== starlight) {
        assertions.push("moonbeam should have starlight for left sibling");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.right !== undefined) {
        assertions.push("moonbeam should have no right sibling");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.parent !== sunshine) {
        assertions.push("moonbean should have sunshin as a parent");
    }
    return assertions;
};
const testRemoveDescendant = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant(starlight, sunshine);
    hooks.insertDescendant(moonbeam, sunshine, starlight);
    hooks.removeDescendant(starlight);
    if (starlight.left !== undefined) {
        assertions.push("starlight should not have a left sibling.");
    }
    if (starlight.right !== undefined) {
        assertions.push("starlight should not have a right sibling.");
    }
    if (starlight.parent !== undefined) {
        assertions.push("starlight should not have a parent.");
    }
    if (moonbeam.left !== undefined) {
        assertions.push("moonbeam should not have a left sibling.");
    }
    if (moonbeam.right !== undefined) {
        assertions.push("moonbeam should not have a right sibling.");
    }
    if (moonbeam.parent !== sunshine) {
        assertions.push("moonbeam should have sunshine as a parent.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.leftChild !== moonbeam) {
        assertions.push("sunshine should have moonbeam as a left child.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.rightChild !== moonbeam) {
        assertions.push("sunshine should have moonbeam as a right child.");
    }
    return assertions;
};
const testRemoveAllDescendants = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant(starlight, sunshine);
    hooks.insertDescendant(moonbeam, sunshine, starlight);
    hooks.removeDescendant(starlight);
    hooks.removeDescendant(moonbeam);
    if (starlight.left !== undefined) {
        assertions.push("starlight should not have a left sibling.");
    }
    if (starlight.right !== undefined) {
        assertions.push("starlight should not have a right sibling.");
    }
    if (starlight.parent !== undefined) {
        assertions.push("starlight should not have a parent.");
    }
    if (moonbeam.left !== undefined) {
        assertions.push("moonbeam should not have a left sibling.");
    }
    if (moonbeam.right !== undefined) {
        assertions.push("moonbeam should not have a right sibling.");
    }
    if (moonbeam.parent !== undefined) {
        assertions.push("moonbeam should not have a parent.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.leftChild !== undefined) {
        assertions.push("sunshine should not have a left child.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.rightChild !== undefined) {
        assertions.push("sunshine should not have a right child.");
    }
    return assertions;
};
const tests = [
    testCreateNode,
    testCreateTextNode,
    testSetAttribute,
    testInsertDescendant,
    testRemoveDescendant,
    testRemoveAllDescendants, 
];
const unitTestTestHooks = {
    title,
    tests,
    runTestsAsynchronously: true
};
const tests1 = [
    unitTestTestHooks, 
];
export { tests1 as tests };
