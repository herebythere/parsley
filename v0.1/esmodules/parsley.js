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
const draw = (templateArray, ...injections)=>{
    return {
        injections,
        templateArray
    };
};
export { hooks as hooks, draw as draw };
