// brian taylor vann
// attribute crawl

import type { AttributeAction } from "../../type_flyweight/attribute_crawl.ts";
import type { Template } from "../../type_flyweight/template.ts";
import type { Vector } from "../../type_flyweight/text_vector.ts";

import {
  copy,
  decrementTarget,
  hasOriginEclipsedTaraget,
  incrementOrigin,
} from "../../text_vector/text_vector.ts";
import { getCharAtPosition } from "../../text_position/text_position.ts";

type AttributeCrawl = <N, A>(
  template: Template<N, A>,
  vectorBounds: Vector,
) => AttributeAction | undefined;

type AttributeValueCrawl = <N, A>(
  template: Template<N, A>,
  vectorBounds: Vector,
  Attributekind: AttributeAction,
) => AttributeAction | undefined;

type BreakRunes = Record<string, boolean>;

const QUOTE_RUNE = '"';
const ASSIGN_RUNE = "=";

const ATTRIBUTE_FOUND = "ATTRIBUTE_FOUND";
const ATTRIBUTE_ASSIGNMENT = "ATTRIBUTE_ASSIGNMENT";
const IMPLICIT_ATTRIBUTE = "IMPLICIT_ATTRIBUTE";
const EXPLICIT_ATTRIBUTE = "EXPLICIT_ATTRIBUTE";
const INJECTED_ATTRIBUTE = "INJECTED_ATTRIBUTE";

const BREAK_RUNES: BreakRunes = {
  " ": true,
  "\n": true,
  "/": true,
};

const getAttributeName: AttributeCrawl = (template, vectorBounds) => {
  let positionChar = getCharAtPosition(template, vectorBounds.origin);
  if (positionChar === undefined || BREAK_RUNES[positionChar]) {
    return;
  }
  const bounds: Vector = copy(vectorBounds);
  let tagNameCrawlState = ATTRIBUTE_FOUND;

  while (
    tagNameCrawlState === ATTRIBUTE_FOUND &&
    !hasOriginEclipsedTaraget(vectorBounds)
  ) {
    if (incrementOrigin(template, vectorBounds) === undefined) {
      // implicit
      tagNameCrawlState = IMPLICIT_ATTRIBUTE;
      break;
    }

    positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar === undefined) {
      return;
    }
    tagNameCrawlState = ATTRIBUTE_FOUND;
    if (BREAK_RUNES[positionChar]) {
      tagNameCrawlState = IMPLICIT_ATTRIBUTE;
    }
    if (positionChar === ASSIGN_RUNE) {
      tagNameCrawlState = ATTRIBUTE_ASSIGNMENT;
    }
  }

  // we have found a tag, copy vector
  const attributeVector: Vector = {
    origin: { ...bounds.origin },
    target: { ...vectorBounds.origin },
  };

  // edge case, we've found text but no break runes
  if (tagNameCrawlState === ATTRIBUTE_FOUND) {
    return {
      kind: IMPLICIT_ATTRIBUTE,
      attributeVector,
    };
  }

  // if implict attribute
  if (tagNameCrawlState === IMPLICIT_ATTRIBUTE) {
    if (BREAK_RUNES[positionChar]) {
      decrementTarget(template, attributeVector);
    }

    return {
      kind: IMPLICIT_ATTRIBUTE,
      attributeVector,
    };
  }

  if (tagNameCrawlState === ATTRIBUTE_ASSIGNMENT) {
    decrementTarget(template, attributeVector);
    return {
      kind: EXPLICIT_ATTRIBUTE,
      valueVector: {
        origin: { arrayIndex: -1, stringIndex: -1 },
        target: { arrayIndex: -1, stringIndex: -1 },
      },
      attributeVector,
    };
  }
};

const getAttributeValue: AttributeValueCrawl = (
  template,
  vectorBounds,
  attributeAction,
) => {
  let positionChar = getCharAtPosition(template, vectorBounds.origin);
  if (positionChar !== ASSIGN_RUNE) {
    return;
  }

  const bound = copy(vectorBounds);

  incrementOrigin(template, vectorBounds);
  positionChar = getCharAtPosition(template, vectorBounds.origin);
  if (positionChar !== QUOTE_RUNE) {
    return;
  }

  // we have an attribute!
  const arrayIndex = vectorBounds.origin.arrayIndex;
  const valVector = copy(vectorBounds);

  // check for injected attribute
  // incrementOrigin(template, vectorBounds)
  if (incrementOrigin(template, vectorBounds) === undefined) {
    return;
  }
  positionChar = getCharAtPosition(template, vectorBounds.origin);

  let arrayIndexDistance = Math.abs(
    arrayIndex - vectorBounds.origin.arrayIndex,
  );

  // check if quote rune?
  if (arrayIndexDistance === 1 && positionChar === QUOTE_RUNE) {
    return {
      kind: INJECTED_ATTRIBUTE,
      injectionID: arrayIndex,
      attributeVector: attributeAction.attributeVector,
      valueVector: {
        origin: { ...valVector.origin },
        target: { ...vectorBounds.origin },
      },
    };
  }

  if (arrayIndexDistance > 0) {
    return;
  }

  while (
    positionChar !== QUOTE_RUNE &&
    !hasOriginEclipsedTaraget(vectorBounds)
  ) {
    if (incrementOrigin(template, vectorBounds) === undefined) {
      return;
    }
    positionChar = getCharAtPosition(template, vectorBounds.origin);

    arrayIndexDistance = Math.abs(arrayIndex - vectorBounds.origin.arrayIndex);
    if (arrayIndexDistance > 0) {
      return;
    }
  }

  // exlpicit attribute found
  if (
    attributeAction.kind === "EXPLICIT_ATTRIBUTE" &&
    positionChar === QUOTE_RUNE
  ) {
    attributeAction.valueVector = {
      origin: { ...valVector.origin },
      target: { ...vectorBounds.origin },
    };

    return attributeAction;
  }
};

const crawlForAttribute: AttributeCrawl = (template, vectorBounds) => {
  // get first character of attribute or return
  const attrResults = getAttributeName(template, vectorBounds);
  if (attrResults === undefined) {
    return;
  }
  if (attrResults.kind === "IMPLICIT_ATTRIBUTE") {
    return attrResults;
  }

  return getAttributeValue(template, vectorBounds, attrResults);
};

export { crawlForAttribute };
