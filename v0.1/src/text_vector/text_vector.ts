// brian taylor vann
// text vector

import type { Template } from "../type_flyweight/template.ts";
import type { Position, Vector } from "../type_flyweight/text_vector.ts";

import {
  increment,
} from "../text_position/text_position.ts";

type Create = (position?: Position) => Vector;

// type CreateFollowingVector = <N, A>(
//   template: Template<N, A>,
//   vector: Vector,
// ) => Vector | undefined;

type Copy = (vector: Vector) => Vector;

type GetTagetChar = <N, A>(
  template: Template<N, A>,
  vector: Vector,
) => string | undefined;

type Increment = <N, A>(
  template: Template<N, A>,
  vector: Vector,
) => Vector | undefined;

type HasOriginEclipsedTaraget = (vector: Vector) => boolean;

type GetTextFromVector = <N, A>(
  template: Template<N, A>,
  vector: Vector,
) => string | undefined;

const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
};

const create: Create = (position = DEFAULT_POSITION) => ({
  origin: { ...position },
  target: { ...position },
});

const createFromVector = <N, A>(template: Template<N, A>) => {
  const last = template.templateArray.length - 1;
  const lastChunk = template.templateArray[last].length - 1;
  return {
    origin: {x: 0, y: 0},
    target: {x: last, y: lastChunk},
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

const hasOriginEclipsedTaraget: HasOriginEclipsedTaraget = (vector) => 
    vector.origin.x >= vector.target.x &&
    vector.origin.y >= vector.target.y;

const getText: GetTextFromVector = (template, vector) => {
  let templateText = template.templateArray[vector.origin.x];
  if (templateText === undefined) return;

  const texts: string[] = [];

  const targetX = vector.target.x;
  const originX = vector.origin.x;
  const xDistance = targetX - originX;
  if (xDistance < 0) {
    return;
  }

  if (xDistance === 0) {
    const yDistance = vector.target.y - vector.origin.y + 1;
    return templateText.substr(vector.origin.y, yDistance);
  }

  const firstDistance = templateText.length - vector.origin.y;
  const first = templateText.substr(vector.origin.y, firstDistance);
  texts.push(first);

  const safety = 512;
  let depth = 0;
  const bookend = targetX - 1;
  let index = originX + 1;
  while (depth < safety && index <= bookend) {
    const piece = template.templateArray[index];
    if (piece === undefined) {
      return;
    }

    texts.push(piece);
    index += 1;
    depth += 1;
  }

  const lastTemplate = template.templateArray[targetX];
  if (lastTemplate === undefined) {
    return;
  }

  let last = lastTemplate.substr(0, vector.target.y + 1);
  texts.push(last);

  return texts.join("");
};

export {
  copy,
  create,
  createFromVector,
  getText,
  hasOriginEclipsedTaraget,
  incrementOrigin,
};
