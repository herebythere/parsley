import type { Position, Vector } from "../type_flyweight/text_vector.ts";

const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
};

function increment(
  template: TemplateStringsArray,
  position: Position,
): Position | undefined {
  // template boundaries
  const templateLength = template.length - 1;
  if (position.x > templateLength) return;

  const chunk = template[position.x];
  if (chunk === undefined) return;

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
  template: TemplateStringsArray,
  position: Position,
): string | undefined {
  const str = template[position.x];
  if (str === undefined) return;
  if (str.length === 0) return str;

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

function createFromTemplate(template: TemplateStringsArray): Vector {
  const x = template.length - 1;
  const y = template[x].length - 1;

  return {
    origin: { x: 0, y: 0 },
    target: { x, y },
  };
}

function copy(vector: Vector): Vector {
  return {
    origin: { ...vector.origin },
    target: { ...vector.target },
  };
}

function getText(
  template: TemplateStringsArray,
  vector: Vector,
): string | undefined {
  const origin = vector.origin;
  let templateText = template[origin.x];
  if (templateText === undefined) return;

  return templateText.substr(origin.y, vector.target.y - origin.y + 1);
}

export { copy, create, createFromTemplate, getChar, getText, increment };
