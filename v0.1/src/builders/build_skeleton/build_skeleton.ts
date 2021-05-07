// brian taylor vann
// build skeleton

import type { Template } from "../../type_flyweight/template.ts";
import type { Position } from "../../type_flyweight/text_vector.ts";
import type {
  CrawlResults,
  SkeletonNodes,
} from "../../type_flyweight/skeleton_crawl.ts";

import { crawl } from "../skeleton_crawl/skeleton_crawl.ts";
import {
  copy,
  decrement,
  increment,
} from "../../text_position/text_position.ts";
import { hasOriginEclipsedTaraget } from "../../text_vector/text_vector.ts";

type NodeType = "OPENED" | "INDEPENDENT" | "CLOSED" | "CONTENT";

interface BuildMissingStringNodeParams<N, A> {
  template: Template<N, A>;
  currentCrawl: CrawlResults;
  previousCrawl?: CrawlResults;
}

type BuildMissingStringNode = <N, A>(
  params: BuildMissingStringNodeParams<N, A>,
) => CrawlResults | void;

type BuildSkeletonSieve = Record<string, NodeType>;

type BuildSkeleton = <N, A>(template: Template<N, A>) => SkeletonNodes;

interface IsDistanceGreaterThanOneParams<N, A> {
  template: Template<N, A>;
  origin: Position;
  target: Position;
}
type IsDistanceGreaterThanOne = <N, A>(
  params: IsDistanceGreaterThanOneParams<N, A>,
) => boolean;

const MAX_DEPTH = 128;

const DEFAULT_CRAWL_RESULTS: CrawlResults = {
  nodeType: "CONTENT",
  vector: {
    origin: { arrayIndex: 0, stringIndex: 0 },
    target: { arrayIndex: 0, stringIndex: 0 },
  },
};

const SKELETON_SIEVE: BuildSkeletonSieve = {
  ["OPENED_FOUND"]: "OPENED",
  ["INDEPENDENT_FOUND"]: "INDEPENDENT",
  ["CLOSED_FOUND"]: "CLOSED",
  ["CONTENT"]: "CONTENT",
};

const isDistanceGreaterThanOne: IsDistanceGreaterThanOne = ({
  template,
  origin,
  target,
}) => {
  if (hasOriginEclipsedTaraget({ origin, target })) {
    return false;
  }

  const originCopy = copy(origin);
  if (increment(template, originCopy) === undefined) {
    return false;
  }

  if (
    target.arrayIndex === originCopy.arrayIndex &&
    target.stringIndex === originCopy.stringIndex
  ) {
    return false;
  }

  return true;
};

const buildMissingStringNode: BuildMissingStringNode = ({
  template,
  previousCrawl,
  currentCrawl,
}) => {
  // get text vector
  const originPos = previousCrawl !== undefined
    ? previousCrawl.vector.target
    : DEFAULT_CRAWL_RESULTS.vector.target;

  const targetPos = currentCrawl.vector.origin;

  if (
    !isDistanceGreaterThanOne({
      template,
      origin: originPos,
      target: targetPos,
    })
  ) {
    return;
  }

  // copy and correlate position values
  const origin = previousCrawl === undefined
    ? copy(DEFAULT_CRAWL_RESULTS.vector.target)
    : copy(previousCrawl.vector.target);

  const target = copy(currentCrawl.vector.origin);

  decrement(template, target);
  if (previousCrawl !== undefined) {
    increment(template, origin);
  }

  return {
    nodeType: "CONTENT",
    vector: {
      origin,
      target,
    },
  };
};

const buildSkeleton: BuildSkeleton = (template) => {
  const skeleton: SkeletonNodes = [];

  let previousCrawl: CrawlResults | undefined;
  let currentCrawl = crawl(template, previousCrawl);

  let depth = 0;
  while (currentCrawl && depth < MAX_DEPTH) {
    // get string in between crawls
    const stringBone = buildMissingStringNode({
      template,
      previousCrawl,
      currentCrawl,
    });

    if (stringBone) {
      skeleton.push(stringBone);
    }

    if (SKELETON_SIEVE[currentCrawl.nodeType]) {
      skeleton.push(currentCrawl);
    }

    previousCrawl = currentCrawl;
    currentCrawl = crawl(template, previousCrawl);

    depth += 1;
  }

  return skeleton;
};

export type { SkeletonNodes };

export { buildSkeleton };
