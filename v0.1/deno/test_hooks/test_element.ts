// brian taylor vann
// test element

type TestAttributes = string | number | boolean | undefined;

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

export type { TestNode, TestAttributes };
