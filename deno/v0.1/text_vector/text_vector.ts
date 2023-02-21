import type { Position, Vector } from "../type_flyweight/text_vector.ts";

const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
};

function increment(
  template: Readonly<string[]>,
  position: Position,
): Position | undefined {
  const templateLength = template.length - 1;
  const chunk = template[position.x];
  const chunkLength = chunk.length - 1;
  if (position.x >= templateLength && position.y >= chunkLength) return;

  position.y += 1;
  if (position.y > chunkLength) {
    position.x += 1;
    position.y = 0;
  }

  return position;
}

function getChar(
  template: Readonly<string[]>,
  position: Position,
): string | undefined {
  const str = template[position.x];
  if (str === undefined) return;
  if (str.length === 0) return "";

  return str[position.y];
}

function create(
  origin: Position = DEFAULT_POSITION,
  target: Position = origin,
): Vector {
  return {
    origin: { ...origin },
    target: { ...target },
  };
}

function copy(vector: Vector): Vector {
  return {
    origin: { ...vector.origin },
    target: { ...vector.target },
  };
}

function getText(
  template: Readonly<string[]>,
  vector: Vector,
): string | undefined {
  const origin = vector.origin;
  let templateText = template[origin.x];
  if (templateText) {
    return templateText.substr(origin.y, vector.target.y - origin.y + 1);
  }
}

export { copy, create, getChar, getText, increment };
