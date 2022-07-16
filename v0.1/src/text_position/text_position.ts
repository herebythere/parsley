// brian taylor vann
// text position

import type { Template } from "../type_flyweight/template.ts";
import type { Position } from "../type_flyweight/text_vector.ts";

type Create = (position?: Position) => Position;

type Increment = <N, A>(
  template: Template<N, A>,
  position: Position,
) => Position | undefined;

type GetChar = <N, A>(
  template: Template<N, A>,
  position: Position,
) => string | undefined;

const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
};

const create: Create = (position = DEFAULT_POSITION) => ({ ...position });

const increment: Increment = (template, position) => {
  // template boundaries
  const templateLength = template.templateArray.length - 1;
  if (position.x > templateLength) return;

  const chunk = template.templateArray[position.x];
  if (chunk === undefined) return;

  const chunkLength = chunk.length - 1;
  if (position.x >= templateLength && position.y >= chunkLength) {
    return;
  }

  position.y += 1;
  if (position.y > chunkLength) {
    position.x += 1;
    position.y = 0;
  };

  return position;
};

const getChar: GetChar = (template, position) => {
  return template.templateArray[position.x]?.[position.y];
};

export { create, getChar, increment };
