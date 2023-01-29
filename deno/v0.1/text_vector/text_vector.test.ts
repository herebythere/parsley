import type { Vector } from "../type_flyweight/text_vector.ts";

import { samestuff } from "../test_deps.ts";
import {
  copy,
  create,
  createFromTemplate,
  getText,
  increment,
} from "./text_vector.ts";

function testTextInterpolator<I>(
  templateArray: TemplateStringsArray,
  ...injections: I[]
) {
  return templateArray;
}

const title = "text_vector";
const runTestsAsynchronously = true;

function createTextVector() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  };

  const vector = create();

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function createTextVectorFromPosition() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 4, y: 3 },
    target: { x: 4, y: 3 },
  };

  const vector = create({
    y: 3,
    x: 4,
  });

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function copyTextVector() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 0, y: 1 },
    target: { x: 2, y: 3 },
  };

  const vector = copy(expectedResults);
  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function incrementTextVector() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 0, y: 1 },
    target: { x: 0, y: 4 },
  };

  const structureRender = testTextInterpolator`hello`;
  const vector: Vector = createFromTemplate(structureRender);

  increment(structureRender, vector.origin);

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function incrementMultiTextVector() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 1, y: 2 },
    target: { x: 1, y: 13 },
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const vector: Vector = createFromTemplate(structureRender);

  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function incrementEmptyTextVector() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 3, y: 0 },
    target: { x: 3, y: -1 },
  };

  const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
  const vector: Vector = createFromTemplate(structureRender);

  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);
  increment(structureRender, vector.origin);

  if (increment(structureRender, vector.origin) !== undefined) {
    assertions.push("should not return after traversed");
  }

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function incrementTextVectorTooFar() {
  const assertions = [];

  const expectedResults = {
    origin: { x: 1, y: 13 },
    target: { x: 1, y: 13 },
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const vector: Vector = createFromTemplate(structureRender);

  const MAX_DEPTH = 20;
  let safety = 0;
  while (increment(structureRender, vector.origin) && safety < MAX_DEPTH) {
    safety += 1;
  }

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
}

function testGetTextReturnsActualText() {
  const expectedResult = "world";
  const assertions = [];

  const structureRender = testTextInterpolator`hey world, how are you?`;
  const vector: Vector = {
    origin: {
      x: 0,
      y: 4,
    },
    target: {
      x: 0,
      y: 8,
    },
  };

  const results = getText(structureRender, vector);
  if (expectedResult !== results) {
    assertions.push("text should say 'world'");
  }

  return assertions;
}

function testGetTextOverTemplate() {
  const expectedResult = "how";
  const assertions = [];

  const structureRender =
    testTextInterpolator`hey ${"world"}, how ${"are"} you?`;
  const vector: Vector = {
    origin: {
      x: 1,
      y: 2,
    },
    target: {
      x: 1,
      y: 4,
    },
  };

  const results = getText(structureRender, vector);
  if (expectedResult !== results) {
    assertions.push("text should say 'world'");
  }

  return assertions;
}

function testGetTextLastChunkTemplate() {
  const expectedResult = "buster";
  const assertions = [];

  const structureRender =
    testTextInterpolator`hey ${"world"}, how ${"are"} you ${"doing"} buster?`;
  const vector: Vector = {
    origin: {
      x: 3,
      y: 1,
    },
    target: {
      x: 3,
      y: 6,
    },
  };

  const results = getText(structureRender, vector);
  if (expectedResult !== results) {
    assertions.push("text should say 'world'");
  }

  return assertions;
}

const tests = [
  createTextVector,
  createTextVectorFromPosition,
  copyTextVector,
  incrementTextVector,
  incrementMultiTextVector,
  incrementEmptyTextVector,
  incrementTextVectorTooFar,
  testGetTextReturnsActualText,
  testGetTextOverTemplate,
  testGetTextLastChunkTemplate,
];

const unitTestTextVector = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestTextVector };
