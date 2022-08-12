// brian taylor vann
// test hooks

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { Draw } from "../type_flyweight/template.ts";
import type { TestNode } from "./test_element.ts";

type TestAttributes = string | number;

const hooks: Hooks<TestNode, TestAttributes> = {
  createNode: (tagname) => {
    return { kind: "ELEMENT", attributes: {}, tagname };
  },
  createTextNode: (text) => {
    return { kind: "TEXT", text };
  },
  setAttribute: (node, attribute, value) => {
    if (node.kind === "ELEMENT") {
      node.attributes[attribute] = value;
    }
  },
  removeAttribute: (node, attribute) => {
    if (node.kind === "ELEMENT") {
      node.attributes[attribute] = undefined;
    }
  },
  getSiblings: (sibling) => {
    return [sibling.left, sibling.right];
  },
  insertDescendant: (descendant, parentNode, leftNode) => {
    // set descendant
    if (leftNode !== undefined) {
      const leftRightDescendant = leftNode.right;
      descendant.right = leftRightDescendant;
      if (leftRightDescendant !== undefined) {
        leftRightDescendant.left = descendant;
      }

      descendant.left = leftNode;
      leftNode.right = descendant;
    }

    // appending
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
  removeDescendant: (descendant) => {
    const parent = descendant.parent;
    const leftNode = descendant.left;
    const rightNode = descendant.right;

    // remove descendant references
    descendant.parent = undefined;
    descendant.right = undefined;
    descendant.left = undefined;

    // if descendant is leftChild
    if (leftNode !== undefined) {
      leftNode.right = rightNode;
    }

    // if descendant is rightChild
    if (rightNode !== undefined) {
      rightNode.left = leftNode;
    }

    if (parent === undefined) {
      return;
    }

    // if descendant is rightChild
    if (descendant === parent.leftChild) {
      parent.leftChild = rightNode;
    }
    if (descendant === parent.rightChild) {
      parent.rightChild = leftNode;
    }

    return parent;
  },
};

const draw: Draw<TestNode, TestAttributes> = (templateArray, ...injections) => {
  return {
    injections,
    templateArray,
  };
};

export type { TestAttributes };

export { draw, hooks };
