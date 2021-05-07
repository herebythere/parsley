// brian taylor vann
// tag name crawl

import type { Template } from "../../type_flyweight/template.ts";
import type { Vector } from "../../type_flyweight/text_vector.ts";

import {
  copy,
  decrementTarget,
  hasOriginEclipsedTaraget,
  incrementOrigin,
} from "../../text_vector/text_vector.ts";

import { getCharAtPosition } from "../../text_position/text_position.ts";

type BreakRunes = Record<string, boolean>;

const BREAK_RUNES: BreakRunes = {
  " ": true,
  "\n": true,
};

const crawlForTagName = <N, A>(
  template: Template<N, A>,
  innerXmlBounds: Vector,
) => {
  let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
  if (positionChar === undefined || BREAK_RUNES[positionChar]) {
    return;
  }

  const tagVector = copy(innerXmlBounds);
  while (
    BREAK_RUNES[positionChar] === undefined &&
    !hasOriginEclipsedTaraget(tagVector)
  ) {
    if (incrementOrigin(template, tagVector) === undefined) {
      return;
    }
    positionChar = getCharAtPosition(template, tagVector.origin);
    if (positionChar === undefined) {
      return;
    }
  }

  const adjustedVector: Vector = {
    origin: { ...innerXmlBounds.origin },
    target: { ...tagVector.origin },
  };

  // decrement target if break rune found
  if (positionChar !== undefined && BREAK_RUNES[positionChar]) {
    decrementTarget(template, adjustedVector);
  }

  return adjustedVector;
};

export { crawlForTagName };
