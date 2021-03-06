// brian taylor vann
// build render

import { buildIntegrals } from "../build_integrals/build_integrals.ts";
import { buildRender } from "./build_render.ts";
import { buildSkeleton } from "../build_skeleton/build_skeleton.ts";
import { Context } from "../../chunk/chunk.ts";
import { hooks, render, TestAttributes } from "../../test_hooks/test_hooks.ts";
import { Integrals } from "../../type_flyweight/integrals.ts";
import { Template, AttributeValue } from "../../type_flyweight/template.ts";
import { TestNode } from "../../test_hooks/test_element.ts";
import { Chunker } from "../../type_flyweight/chunker.ts";

interface InterpolatorResults<N, A> {
  template: Template<N, A>;
  integrals: Integrals;
}
type TextTextInterpolator<N, A, P, S> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => InterpolatorResults<N, A>;

const title = "build_render";
const runTestsAsynchronously = true;

const testTextInterpolator: TextTextInterpolator<
  TestNode,
  TestAttributes,
  Object,
  unknown
> = (templateArray, ...injections) => {
  const template = { templateArray, injections };
  const params = {
    skeleton: buildSkeleton(template),
    template,
  };

  return {
    template,
    integrals: buildIntegrals(params),
  };
};

// createNode,
const testCreateNode = () => {
  const assertions: string[] = [];

  const { template, integrals } = testTextInterpolator`<p>`;
  const results = buildRender({
    hooks,
    integrals,
    template,
  });

  if (results.siblings.length !== 1) {
    assertions.push("siblings should have length 1");
    return assertions;
  }

  const sibling = results.siblings[0][0];

  if (sibling.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
    return assertions;
  }
  if (sibling.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }

  return assertions;
};

const testCloseNode = () => {
  const assertions: string[] = [];

  const { template, integrals } = testTextInterpolator`<p></p>`;
  const results = buildRender({
    hooks,
    integrals,
    template,
  });

  if (results.siblings.length !== 1) {
    assertions.push("siblings should have length 1");
    return assertions;
  }

  const sibling = results.siblings[0][0];

  if (sibling.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
    return assertions;
  }
  if (sibling.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }

  return assertions;
};

const testTextNode = () => {
  const assertions: string[] = [];

  const {
    template,
    integrals,
  } = testTextInterpolator`hello world!<p>It's me!</p>`;

  const results = buildRender({
    hooks,
    integrals,
    template,
  });

  if (results.siblings.length !== 2) {
    assertions.push("siblings should have length 1");
    return assertions;
  }

  const hopefulText = results.siblings[0][0];
  const hopefulElement = results.siblings[1][0];
  if (Array.isArray(hopefulText)) {
    assertions.push("sibling should not be an array");
    return assertions;
  }
  if (hopefulText.kind !== "TEXT") {
    assertions.push("sibling should be an TEXT");
  }
  if (hopefulText.kind === "TEXT" && hopefulText.text !== "hello world!") {
    assertions.push("sibling tagname should be p");
  }

  if (Array.isArray(hopefulElement)) {
    assertions.push("sibling should not be an array");
    return assertions;
  }
  if (hopefulElement.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
  }
  if (hopefulElement.kind === "ELEMENT" && hopefulElement.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }

  return assertions;
};

const testAddAttributesToNodes = () => {
  const assertions: string[] = [];

  const { template, integrals } = testTextInterpolator`
    <p
      checked
      label=""
      disabled="false"
      skies="${"blue"}">
        Hello world, it's me!
    </p>`;

  const results = buildRender({
    hooks,
    integrals,
    template,
  });

  if (results.siblings.length !== 2) {
    assertions.push("siblings should have length 2");
    return assertions;
  }

  const sibling = results.siblings[1][0];

  if (sibling.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
    return assertions;
  }
  if (sibling.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }
  if (sibling.attributes["checked"] !== true) {
    assertions.push("sibling should be checked");
  }
  if (sibling.attributes["disabled"] !== "false") {
    assertions.push("sibling should be disabled");
  }

  if (sibling.attributes["label"] !== "") {
    assertions.push("label should be empty string");
  }
  if (sibling.attributes["skies"] !== "blue") {
    assertions.push("sibling skies should be blue");
  }

  return assertions;
};

const testAddAttributesToMultipleNodes = () => {
  const assertions: string[] = [];

  const { template, integrals } = testTextInterpolator`
    <p>No properties in this paragraph!</p>
    <p
      checked
      disabled="false"
      skies="${"blue"}">
        Hello world, it's me!
    </p>`;

  const results = buildRender({
    hooks,
    integrals,
    template,
  });

  if (results.siblings.length !== 4) {
    assertions.push("siblings should have length 4");
    return assertions;
  }

  const firstParagraph = results.siblings[1][0];
  if (firstParagraph.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
  }
  if (firstParagraph.kind === "ELEMENT" && firstParagraph.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }

  const secondParagraph = results.siblings[3][0];
  if (Array.isArray(secondParagraph)) {
    assertions.push("sibling should not be an array");
    return assertions;
  }
  if (secondParagraph.kind !== "ELEMENT") {
    assertions.push("sibling should be an ELEMENT");
    return assertions;
  }
  if (secondParagraph.tagname !== "p") {
    assertions.push("sibling tagname should be p");
  }
  if (secondParagraph.attributes["checked"] !== true) {
    assertions.push("sibling should be checked");
  }
  if (secondParagraph.attributes["disabled"] !== "false") {
    assertions.push("sibling should be disabled");
  }

  return assertions;
};

const testAddContext = () => {
  const assertions: string[] = [];

  // create a small renderer
  const chunker: Chunker<TestNode, TestAttributes, {}, unknown> = {
    update: ({ params, state }) => {
      return render`
        <p>HelloWorld!</p>
      `;
    },
    connect: () => {},
    disconnect: () => {},
  };

  // create and update context
  const context = new Context({ params: {}, hooks, chunker });

  const {
    integrals: contextIntegrals,
    template: contextTemplate,
  } = testTextInterpolator`
    <p>${[context]}</p>
  `;

  const results = buildRender({
    hooks,
    integrals: contextIntegrals,
    template: contextTemplate,
  });

  if (results.siblings.length !== 3) {
    assertions.push("siblings should have length 3");
    return assertions;
  }

  const textNode = results.siblings[0][0];
  if (Array.isArray(textNode)) {
    assertions.push("sibling should not be an array");
    return assertions;
  }
  if (textNode.kind !== "TEXT") {
    assertions.push("sibling 0 should have a text");
    return assertions;
  }

  if (results.descendants[0]?.kind !== "CONTEXT_ARRAY") {
    assertions.push("descendant 0 should be a context array");
    return assertions;
  }

  const paragraph = results.siblings[1][0];
  if (Array.isArray(paragraph)) {
    assertions.push("sibling should not be an array");
    return assertions;
  }
  if (paragraph.kind !== "ELEMENT") {
    assertions.push("second sibling should be an ELEMENT");
    return assertions;
  }

  return assertions;
};

const tests = [
  testCreateNode,
  testCloseNode,
  testTextNode,
  testAddAttributesToNodes,
  testAddAttributesToMultipleNodes,
  testAddContext,
];

const unitTestBuildRender = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestBuildRender };
