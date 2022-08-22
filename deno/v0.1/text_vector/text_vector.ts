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
  };

  return position;
};

const getChar: GetChar = (template, position) => 
  template.templateArray[position.x]?.[position.y];

const create: Create = (origin = DEFAULT_POSITION, target = DEFAULT_POSITION) => ({
  origin: { ...origin },
  target: { ...target },
});

const createFromTemplate = <N, A>(template: Template<N, A>) => {
  const x = template.templateArray.length - 1;
  const y = template.templateArray[x].length - 1;

  return {
    origin: {x: 0, y: 0},
    target: {x, y},
  }
}

const copy: Copy = (vector) => {
  return {
    origin: {...vector.origin},
    target: {...vector.target},
  };
};

const incrementOrigin: Increment = (template, vector) => {
  if (increment(template, vector.origin)) {
    return vector;
  }

  return;
};

const getText: GetChar = (template, vector) => {
  let templateText = template.templateArray[vector.origin.x];
  if (templateText === undefined) return;

  const texts: string[] = [];

  const targetX = vector.target.x;
  const originX = vector.origin.x;
  const xDistance = targetX - originX;
  if (xDistance < 0) return;

  if (xDistance === 0) {
    const yDistance = vector.target.y - vector.origin.y + 1;
    return templateText.substr(vector.origin.y, yDistance);
  }

  const firstDistance = templateText.length - vector.origin.y;
  const first = templateText.substr(vector.origin.y, firstDistance);
  texts.push(first);

  const bookend = targetX - 2;
  let index = originX + 1;
  while (index < bookend) {
    const piece = template.templateArray[index];
    if (piece === undefined) return;

    texts.push(piece);
    index += 1;
  }

  const lastTemplate = template.templateArray[targetX];
  if (lastTemplate === undefined) return;

  let last = lastTemplate.substr(0, vector.target.y + 1);
  texts.push(last);

  return texts.join("");
};

export {
  copy,
  create,
  createFromTemplate,
  getText,
  incrementOrigin,
  getChar,
};
