// brian taylor vann
// skeleton crawl types

import type { Position } from "./text_vector.ts";

type Status =
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

interface Atom {
  type: Status;
  pos: Position;
}

type CrawlResults = Atom[];

export type { Atom, Status, CrawlResults };
