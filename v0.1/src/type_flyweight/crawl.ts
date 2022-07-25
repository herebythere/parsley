// brian taylor vann
// skeleton crawl types

import type { Position } from "./text_vector.ts";

type CrawlStatus =
  | "TEXT"
  | "0_NODE"
  | "1_NODE"
  | "0_INEPENDENT_NODE"
  | "C_INDEPENDENT_NODE"
  | "0_TAGNAME"
  | "0_COMMENT"
  | "1_COMMENT"
  | "0_COMMENT_CLOSE"
  | "1_COMMENT_CLOSE"
  | "C_COMMENT"
  | "TEXT_COMMENT"
  | "SPACE_ATTRIBUTE";
  // | "OPENED"
  // | "OPENED_VALID"
  // | "OPENED_FOUND"
  // | "CLOSED"
  // | "CLOSED_VALID"
  // | "CLOSED_FOUND"
  // | "INDEPENDENT"
  // | "INDEPENDENT_VALID"
  // | "INDEPENDENT_FOUND"
  // | "ATTRIBUTE"
  // | "ATTRIBUTE_ESC_CHAR";

interface CrawlResults {
  type: CrawlStatus;
  pos: Position;
}

type SkeletonNodes = CrawlResults[];

export type { CrawlResults, CrawlStatus, SkeletonNodes };
