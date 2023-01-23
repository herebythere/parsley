// brian taylor vann
// text vector

import type { Template } from "../type_flyweight/template.ts";
import type { Position, Vector } from "../type_flyweight/text_vector.ts";

type IncrementPos = <N, A>(
  template: Template<N, A>,
  position: Position,
) => Position | undefined;

type GetChar = <N, A>(
  template: Template<N, A>,
  position: Position,
) => string | undefined;

type GetText = <N, A>(
  template: Template<N, A>,
  vector: Vector,
) => string | undefined;

type Create = (origin?: Position, target?: Position) => Vector;
type Copy = (vector: Vector) => Vector;

type Increment = <N, A>(
  template: Template<N, A>,
  vector: Vector,
) => Vector | undefined;

const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
};

const increment: IncrementPos = (template, position) => {
  // template boundaries
  const templateLength = template.templateArray.length - 1;
  if (position.x > templateLength) return;

  const chunk = template.templateArray[position.x];
  if (chunk === undefined) return;

  const chunkLength = chunk.length - 1;
  if (position.x >= templateLength && position.y >= chunkLength) return;

  position.y += 1;
  if (position.y > chunkLength) {
    position.x += 1;
    position.y = 0;
  }

  return position;
};

const getChar: GetChar = (template, position) =>
  template.templateArray[position.x]?.[position.y];

const create: Create = (
  origin = DEFAULT_POSITION,
  target = origin,
) => ({
  origin: { ...origin },
  target: { ...target },
});

const createFromTemplate = <N, A>(template: Template<N, A>) => {
  const x = template.templateArray.length - 1;
  const y = template.templateArray[x].length - 1;

  return {
    origin: { x: 0, y: 0 },
    target: { x, y },
  };
};

const copy: Copy = (vector) => {
  return {
    origin: { ...vector.origin },
    target: { ...vector.target },
  };
};

const incrementOrigin: Increment = (template, vector) => {
  if (increment(template, vector.origin)) {
    return vector;
  }

  return;
};

const getText: GetText = (template, vector) => {
  const origin = vector.origin;
  let templateText = template.templateArray[origin.x];
  if (templateText === undefined) return;

  return templateText.substr(origin.y, vector.target.y - origin.y + 1);
};

export { copy, create, createFromTemplate, getChar, getText, incrementOrigin };
