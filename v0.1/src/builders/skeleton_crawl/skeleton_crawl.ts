// brian taylor vann
// skeleton crawl

import type { Template } from "../../type_flyweight/template.ts";
import type {
  CrawlResults,
  CrawlStatus,
} from "../../type_flyweight/skeleton_crawl.ts";
import type { Position } from "../../type_flyweight/text_vector.ts";

import { routers } from "../skeleton_routers/skeleton_routers.ts";
import {
  create,
  createFollowingVector,
  incrementTarget,
} from "../../text_vector/text_vector.ts";
import {
  copy as copyPosition,
  getCharAtPosition,
} from "../../text_position/text_position.ts";

type Sieve = Partial<Record<CrawlStatus, CrawlStatus>>;

type SetNodeType = <N, A>(
  template: Template<N, A>,
  results: CrawlResults
) => void;

type SetStartStateProperties = <N, A>(
  template: Template<N, A>,
  previousCrawl?: CrawlResults
) => CrawlResults | undefined;

type Crawl = <N, A>(
  template: Template<N, A>,
  previousCrawl?: CrawlResults
) => CrawlResults | undefined;

const validSieve: Sieve = {
  OPENED_VALID: "OPENED_VALID",
  CLOSED_VALID: "CLOSED_VALID",
  INDEPENDENT_VALID: "INDEPENDENT_VALID",
};

const confirmedSieve: Sieve = {
  OPENED_FOUND: "OPENED_FOUND",
  CLOSED_FOUND: "CLOSED_FOUND",
  INDEPENDENT_FOUND: "INDEPENDENT_FOUND",
};

const setStartStateProperties: SetStartStateProperties = (
  template,
  previousCrawl
) => {
  if (previousCrawl === undefined) {
    return {
      nodeType: "CONTENT",
      vector: create(),
    };
  }

  const followingVector = createFollowingVector(template, previousCrawl.vector);
  if (followingVector === undefined) {
    return;
  }

  const crawlState: CrawlResults = {
    nodeType: "CONTENT",
    vector: followingVector,
  };

  return crawlState;
};

const setNodeType: SetNodeType = (template, crawlState) => {
  const nodeStates = routers[crawlState.nodeType];
  const char = getCharAtPosition(template, crawlState.vector.target);

  if (nodeStates !== undefined && char !== undefined) {
    const defaultNodeType = nodeStates["DEFAULT"] ?? "CONTENT";
    crawlState.nodeType = nodeStates[char] ?? defaultNodeType;
  }

  return crawlState;
};

const crawl: Crawl = (template, previousCrawl) => {
  const crawlState = setStartStateProperties(template, previousCrawl);
  if (crawlState === undefined) {
    return;
  }
  setNodeType(template, crawlState);

  let openedPosition: Position | undefined;
  while (incrementTarget(template, crawlState.vector)) {
    if (
      validSieve[crawlState.nodeType] === undefined &&
      crawlState.nodeType !== "ATTRIBUTE" &&
      crawlState.vector.target.stringIndex === 0
    ) {
      crawlState.nodeType = "CONTENT";
    }

    setNodeType(template, crawlState);

    if (crawlState.nodeType === "OPENED") {
      openedPosition = copyPosition(crawlState.vector.target);
    }

    if (confirmedSieve[crawlState.nodeType]) {
      if (openedPosition !== undefined) {
        crawlState.vector.origin = openedPosition;
      }
      break;
    }
  }

  return crawlState;
};

export { crawl };
