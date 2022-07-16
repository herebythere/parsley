// brian taylor vann
// text position

import type { Position } from "../type_flyweight/text_vector.ts";
import type { Template } from "../type_flyweight/template.ts";

import {
  create,
  getChar,
  increment,
} from "./text_position.ts";
import { samestuff } from "../test_deps.ts";

type TestTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const testTextInterpolator: TestTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const title = "text_position";
const runTestsAsynchronously = true;

const createTextPosition = () => {
  const assertions = [];

  const expectedResults = {
    x: 0,
    y: 0,
  };

  const position = create();

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const createTextPositionFromPosition = () => {
  const assertions = [];

  const expectedResults = {
    x: 3,
    y: 4,
  };

  const position = create(expectedResults);

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementTextPosition = () => {
  const assertions = [];

  const expectedResults = {
    x: 0,
    y: 1,
  };

  const structureRender = testTextInterpolator`hello`;
  const position: Position = create();

  increment(structureRender, position);

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementMultiTextPosition = () => {
  const assertions = [];

  const expectedResults = {
    x: 1,
    y: 2,
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const position: Position = create();

  increment(structureRender, position);
  increment(structureRender, position);
  increment(structureRender, position);
  increment(structureRender, position);
  increment(structureRender, position);

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementEmptyTextPosition = () => {
  const assertions = [];

  const expectedResults = {
    x: 3,
    y: 0,
  };

  const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
  const position: Position = create();

  increment(structureRender, position);
  increment(structureRender, position);
  increment(structureRender, position);

  if (increment(structureRender, position) !== undefined) {
    assertions.push("should not return after traversed");
  }

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const incrementTextPositionTooFar = () => {
  const assertions = [];

  const expectedResults = {
    x: 1,
    y: 13,
  };

  const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
  const arrayLength = structureRender.templateArray.length - 1;
  const stringLength = structureRender.templateArray[arrayLength].length - 1;
  const position: Position = {
    x: arrayLength,
    y: stringLength,
  };

  const MAX_DEPTH = 20;
  let safety = 0;
  while (increment(structureRender, position) && safety < MAX_DEPTH) {
    // iterate across structure
    safety += 1;
  }

  if (!samestuff(expectedResults, position)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};


const getCharFromTemplate = () => {
  const assertions = [];
  const structureRender = testTextInterpolator`hello`;
  const position: Position = { x: 0, y: 2 };
  const char = getChar(structureRender, position);

  if (char !== "l") {
    assertions.push("textPosition target is not 'l'");
  }

  return assertions;
};

const tests = [
  createTextPosition,
  createTextPositionFromPosition,
  incrementTextPosition,
  incrementMultiTextPosition,
  incrementEmptyTextPosition,
  incrementTextPositionTooFar,
  getCharFromTemplate,
];

const unitTestTextPosition = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestTextPosition };
