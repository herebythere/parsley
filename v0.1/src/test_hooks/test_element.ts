// brian taylor vann
// test element

import { AttributeValue } from "../type_flyweight/template.ts";

// boolean, string, and undefined are included in Attributes by default
type TestAttributes = AttributeValue<TestNode, string | number>;

interface TestElement {
  kind: "ELEMENT";
  tagname: string;
  attributes: Record<string, TestAttributes>;
  parent?: TestElement;
  left?: TestNode;
  right?: TestNode;
  leftChild?: TestNode;
  rightChild?: TestNode;
}

interface TestText {
  kind: "TEXT";
  text: string;
  parent?: TestElement;
  left?: TestNode;
  right?: TestNode;
}

type TestNode = TestElement | TestText;

export type { TestAttributes, TestNode };
