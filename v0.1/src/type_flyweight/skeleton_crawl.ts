// brian taylor vann
// skeleton crawl types

import type { Vector } from "./text_vector.ts";

type CrawlStatus =
  | "CONTENT"
  | "OPENED"
  | "OPENED_VALID"
  | "OPENED_FOUND"
  | "CLOSED"
  | "CLOSED_VALID"
  | "CLOSED_FOUND"
  | "INDEPENDENT"
  | "INDEPENDENT_VALID"
  | "INDEPENDENT_FOUND"
  | "ATTRIBUTE"
  | "ATTRIBUTE_ESC_CHAR";

interface CrawlResults {
  nodeType: CrawlStatus;
  vector: Vector;
}

type SkeletonNodes = CrawlResults[];

export type { CrawlResults, CrawlStatus, SkeletonNodes };
