// brian taylor vann
// build integrals

import type { Template } from "../../type_flyweight/template.ts";

import type {
  CrawlResults,
  SkeletonNodes,
} from "../../type_flyweight/skeleton_crawl.ts";

import type { Integrals } from "../../type_flyweight/integrals.ts";
import type { Vector } from "../../type_flyweight/text_vector.ts";

import {
  copy,
  createFollowingVector,
  decrementTarget,
  hasOriginEclipsedTaraget,
  incrementOrigin,
} from "../../text_vector/text_vector.ts";

import { getCharAtPosition } from "../../text_position/text_position.ts";
import { crawlForTagName } from "../tag_name_crawl/tag_name_crawl.ts";
import { crawlForAttribute } from "../attribute_crawl/attribute_crawl.ts";

type VectorCrawl = <N, A>(
  template: Template<N, A>,
  innerXmlBounds: Vector,
) => Vector | undefined;

interface AppendNodeParams<N, A> {
  integrals: Integrals;
  template: Template<N, A>;
  chunk: CrawlResults;
}
type AppendNodeIntegrals = <N, A>(
  params: AppendNodeParams<N, A>,
) => Integrals | undefined;

interface AppendNodeKindParams<N, A> {
  kind: "NODE" | "SELF_CLOSING_NODE";
  integrals: Integrals;
  template: Template<N, A>;
  chunk: CrawlResults;
}
type AppendNodeKindIntegrals = <N, A>(
  params: AppendNodeKindParams<N, A>,
) => Integrals | undefined;

interface AppendNodeAttributeParams<N, A> {
  integrals: Integrals;
  template: Template<N, A>;
  chunk: Vector;
}
type AppendNodeAttributeIntegrals = <N, A>(
  params: AppendNodeAttributeParams<N, A>,
) => Integrals | undefined;

interface BuildIntegralsParams<N, A> {
  template: Template<N, A>;
  skeleton: SkeletonNodes;
}
type BuildIntegrals = <N, A>(params: BuildIntegralsParams<N, A>) => Integrals;

const RECURSION_SAFETY = 256;

// creates a side effect in innerXmlBounds
const incrementOriginToNextSpaceRune: VectorCrawl = (
  template,
  innerXmlBounds,
) => {
  let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
  if (positionChar === undefined) {
    return;
  }

  while (positionChar !== " ") {
    if (hasOriginEclipsedTaraget(innerXmlBounds)) {
      return;
    }
    if (incrementOrigin(template, innerXmlBounds) === undefined) {
      return;
    }
    positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
      return;
    }
  }

  return innerXmlBounds;
};

// creates a side effect in innerXmlBounds
const incrementOriginToNextCharRune: VectorCrawl = (
  template,
  innerXmlBounds,
) => {
  let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
  if (positionChar === undefined) {
    return;
  }

  while (positionChar === " ") {
    if (hasOriginEclipsedTaraget(innerXmlBounds)) {
      return;
    }
    if (incrementOrigin(template, innerXmlBounds) === undefined) {
      return;
    }
    positionChar = getCharAtPosition(template, innerXmlBounds.origin);
  }

  return innerXmlBounds;
};

const appendNodeAttributeIntegrals: AppendNodeAttributeIntegrals = ({
  integrals,
  template,
  chunk,
}) => {
  let safety = 0;
  while (!hasOriginEclipsedTaraget(chunk) && safety < RECURSION_SAFETY) {
    safety += 1;

    if (incrementOriginToNextSpaceRune(template, chunk) === undefined) {
      return;
    }
    if (incrementOriginToNextCharRune(template, chunk) === undefined) {
      return;
    }

    const attrCrawl = crawlForAttribute(template, chunk);
    // something has gone wrong and we should stop
    if (attrCrawl === undefined) {
      return;
    }

    // set origin to following position
    if (attrCrawl.kind === "IMPLICIT_ATTRIBUTE") {
      chunk.origin = { ...attrCrawl.attributeVector.target };
    }
    if (attrCrawl.kind === "EXPLICIT_ATTRIBUTE") {
      chunk.origin = { ...attrCrawl.valueVector.target };
    }
    if (attrCrawl.kind === "INJECTED_ATTRIBUTE") {
      chunk.origin = { ...attrCrawl.valueVector.target };
    }

    integrals.push(attrCrawl);
  }

  return integrals;
};

const appendNodeIntegrals: AppendNodeKindIntegrals = ({
  kind,
  integrals,
  template,
  chunk,
}) => {
  const innerXmlBounds = copy(chunk.vector);

  // adjust vector
  incrementOrigin(template, innerXmlBounds);
  decrementTarget(template, innerXmlBounds);

  // get tag name
  const tagNameVector = crawlForTagName(template, innerXmlBounds);
  if (tagNameVector === undefined) {
    return;
  }

  integrals.push({
    kind,
    tagNameVector,
  });

  const followingVector = createFollowingVector(template, tagNameVector);
  if (followingVector === undefined) {
    return;
  }
  followingVector.target = { ...innerXmlBounds.target };

  appendNodeAttributeIntegrals({ integrals, template, chunk: followingVector });

  return integrals;
};

const appendCloseNodeIntegrals: AppendNodeIntegrals = ({
  integrals,
  template,
  chunk,
}) => {
  const innerXmlBounds = copy(chunk.vector);

  // adjust vector
  incrementOrigin(template, innerXmlBounds);
  incrementOrigin(template, innerXmlBounds);
  decrementTarget(template, innerXmlBounds);

  // get tag name
  const tagNameVector = crawlForTagName(template, copy(innerXmlBounds));
  if (tagNameVector === undefined) {
    return;
  }

  // add tag name to
  tagNameVector.origin = { ...innerXmlBounds.origin };

  // append integralAction to integrals
  integrals.push({
    kind: "CLOSE_NODE",
    tagNameVector,
  });

  return integrals;
};

const appendContentIntegrals: AppendNodeIntegrals = ({
  integrals,
  template,
  chunk,
}) => {
  const { origin, target } = chunk.vector;

  if (origin.arrayIndex === target.arrayIndex) {
    integrals.push({ kind: "TEXT", textVector: chunk.vector });
    return;
  }

  let stringIndex = template.templateArray[origin.arrayIndex].length - 1;
  let textVector = {
    origin,
    target: {
      arrayIndex: origin.arrayIndex,
      stringIndex,
    },
  };

  integrals.push({ kind: "TEXT", textVector });
  integrals.push({
    kind: "CHUNK_ARRAY_INJECTION",
    injectionID: origin.arrayIndex,
  });

  // get that middle text stuff
  let arrayIndex = origin.arrayIndex + 1;
  while (arrayIndex < target.arrayIndex) {
    stringIndex = template.templateArray[arrayIndex].length - 1;
    textVector = {
      origin: {
        arrayIndex,
        stringIndex: 0,
      },
      target: {
        arrayIndex,
        stringIndex,
      },
    };

    integrals.push({ kind: "TEXT", textVector });
    integrals.push({
      kind: "CHUNK_ARRAY_INJECTION",
      injectionID: arrayIndex,
    });

    arrayIndex += 1;
  }

  // get that end text stuff
  textVector = {
    origin: {
      arrayIndex: target.arrayIndex,
      stringIndex: 0,
    },
    target,
  };

  integrals.push({ kind: "TEXT", textVector });

  return integrals;
};

const buildIntegrals: BuildIntegrals = ({ template, skeleton }) => {
  const integrals: Integrals = [];

  for (const chunk of skeleton) {
    const nodeType = chunk.nodeType;
    const origin = chunk.vector.origin;

    if (origin.stringIndex === 0 && origin.arrayIndex !== 0) {
      integrals.push({
        kind: "CHUNK_ARRAY_INJECTION",
        injectionID: origin.arrayIndex - 1,
      });
    }

    if (nodeType === "OPENED_FOUND") {
      appendNodeIntegrals({ kind: "NODE", integrals, template, chunk });
    }
    if (nodeType === "CLOSED_FOUND") {
      appendCloseNodeIntegrals({ integrals, template, chunk });
    }
    if (nodeType === "CONTENT") {
      appendContentIntegrals({ integrals, template, chunk });
    }
    if (nodeType === "INDEPENDENT_FOUND") {
      appendNodeIntegrals({
        kind: "SELF_CLOSING_NODE",
        integrals,
        template,
        chunk,
      });
    }
  }

  return integrals;
};

export type { BuildIntegralsParams };

export { buildIntegrals };
