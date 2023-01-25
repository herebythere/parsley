// brian taylor vann
// text vector

import type { Template } from "../type_flyweight/template.ts";
import type { Position, Vector } from "../type_flyweight/text_vector.ts";

type IncrementPos = <I>(
  template: Template<I>,
  position: Position,
) => Position | undefined;

type GetChar = <I>(
  template: Template<I>,
  position: Position,
) => string | undefined;

type GetText = <I>(
  template: Template<I>,
  vector: Vector,
) => string | undefined;

type Create = (origin?: Position, target?: Position) => Vector;
type Copy = (vector: Vector) => Vector;

type Increment = <I>(
  template: Template<I>,
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

const getChar: GetChar = (template, position) => {
	const str = template.templateArray[position.x];
	if (str === undefined) return;
	if (str.length === 0) return "";
	
	return str[position.y]
}

const create: Create = (
  origin = DEFAULT_POSITION,
  target = origin,
) => ({
  origin: { ...origin },
  target: { ...target },
});

const createFromTemplate = <I>(template: Template<I>) => {
  const { templateArray } = template;
  const x = templateArray.length - 1;
  const y = templateArray[x].length - 1;

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
  if (increment(template, vector.origin)) return vector;
};

const getText: GetText = (template, vector) => {
  const origin = vector.origin;
  let templateText = template.templateArray[origin.x];
  if (templateText === undefined) return;

  return templateText.substr(origin.y, vector.target.y - origin.y + 1);
};

export { copy, create, createFromTemplate, getChar, getText, incrementOrigin };
