// brian taylor vann
// text vector

import type { Vector } from "../type_flyweight/text_vector.ts";
import type { Template } from "../type_flyweight/template.ts";

import { samestuff } from "../test_deps.ts";
import {
  copy,
  create,
  getText,
  hasOriginEclipsedTaraget,
  incrementOrigin,
  createFromTemplate,
} from "./text_vector.ts";

type TextTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const testTextInterpolator: TextTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const title = "text_vector";
const runTestsAsynchronously = true;

const createTextVector = () => {
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
};

const createTextVectorFromPosition = () => {
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
};

const copyTextVector = () => {
  const assertions = [];

  const expectedResults = {
    origin: { x: 0, y: 1 },
    target: { x: 2, y: 3 },
  };

  const copiedVector = copy(expectedResults);
  if (!samestuff(expectedResults, copiedVector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementTextVector = () => {
  const assertions = [];

  const expectedResults = {
    origin: { x: 0, y: 1 },
    target: { x: 0, y: 4 },
  };

  const structureRender = testTextInterpolator`hello`;
  const vector: Vector = createFromTemplate(structureRender);

  incrementOrigin(structureRender, vector);

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementMultiTextVector = () => {
  const assertions = [];

  const expectedResults = {
    origin: { x: 1, y: 2 },
    target: { x: 1, y: 13 },
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const vector: Vector = createFromTemplate(structureRender);

  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementEmptyTextVector = () => {
  const assertions = [];

  const expectedResults = {
    origin: { x: 3, y: 0 },
    target: { x: 3, y: -1 },
  };

  const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
  const vector: Vector = createFromTemplate(structureRender);

  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);

  if (incrementOrigin(structureRender, vector) !== undefined) {
    assertions.push("should not return after traversed");
  }

  if (!samestuff(expectedResults, vector)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementTextVectorTooFar = () => {
  const assertions = [];

  const expectedResults = {
    origin: { x: 1, y: 13 },
    target: { x: 1, y: 13 },
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const results: Vector = createFromTemplate(structureRender);

  const MAX_DEPTH = 20;
  let safety = 0;
  while (incrementOrigin(structureRender, results) && safety < MAX_DEPTH) {
    safety += 1;
  }

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const testHasOriginEclipsedTaraget = () => {
  const assertions = [];

  const vector: Vector = create();
  const results = hasOriginEclipsedTaraget(vector);

  if (results !== true) {
    assertions.push("orign eclipsed target");
  }

  return assertions;
};

const testHasOriginNotEclipsedTaraget = () => {
  const assertions = [];

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const vector: Vector = createFromTemplate(structureRender);

  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);
  incrementOrigin(structureRender, vector);

  const results = hasOriginEclipsedTaraget(vector);

  if (results !== false) {
    assertions.push("orign has not eclipsed target");
  }

  return assertions;
};

const testGetTextReturnsActualText = () => {
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
};

const testGetTextOverTemplate = () => {
  const expectedResult = "how  you";
  const assertions = [];

  const structureRender = testTextInterpolator
    `hey ${"world"}, how ${"are"} you?`;
  const vector: Vector = {
    origin: {
      x: 1,
      y: 2,
    },
    target: {
      x: 2,
      y: 3,
    },
  };

  const results = getText(structureRender, vector);
  if (expectedResult !== results) {
    assertions.push("text should say 'world'");
  }

  return assertions;
};

const testGetTextOverChonkyTemplate = () => {
  const expectedResult = "how  you  buster";
  const assertions = [];

  const structureRender = testTextInterpolator
    `hey ${"world"}, how ${"are"} you ${"doing"} buster?`;
  const vector: Vector = {
    origin: {
      x: 1,
      y: 2,
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
};

const tests = [
  createTextVector,
  createTextVectorFromPosition,
  copyTextVector,
  incrementTextVector,
  incrementMultiTextVector,
  incrementEmptyTextVector,
  incrementTextVectorTooFar,
  testHasOriginEclipsedTaraget,
  testHasOriginNotEclipsedTaraget,
  testGetTextReturnsActualText,
  testGetTextOverTemplate,
  testGetTextOverChonkyTemplate,
];

const unitTestTextVector = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestTextVector };
