// brian taylor vann
// skeleton routers

import { CrawlStatus } from "../../type_flyweight/skeleton_crawl.ts";

type Routes = Record<string, CrawlStatus>;
type Routers = Partial<Record<CrawlStatus, Routes>>;

const routers: Routers = {
  TEXT: {
    "<": "NODE_0",
    DEFAULT: "TEXT",
  },
  NODE_0: {
    "-": "COMMENT_0",
    " ": "TEXT",
    "\n": "TEXT",
    "<": "NODE_0",
    "/": "TEXT",
    ">": "TEXT",
    DEFAULT: "NODE_1",
  },
  // COMMENT: {
  //   "-": "NODE_COMMENT_PENDING",
  //   DEFAULT: "TEXT"
  // },
  // NODE_COMMENT_PENDING: {
  //   "-": "NODE_COMMENT_PENDING_1",
  //   DEFAULT: "TEXT"
  // },
  // NODE_COMMENT_PENDING_1: {
  //   "-": "NODE_COMMENT_PENDING",
  // },
  // COMMENT_CONTENT: {
  //   "-": "COMMENT_CLOSED",
  //   DEFAULT: "COMMENT_CONTENT",
  // },
  // COMMENT_CLOSED: {
  //   "-": "COMMENT_CLOSED_PROMPT",
  //   DEFAULT: "COMMENT_CONENT",
  // },
  // COMMENT_CLOSED_PROMPT: {
  //   ">": "COMMENT_CLOSED_VALID",
  //   DEFAULT: "COMMENT_CONTENT",
  // },



  // NODE_PENDING: {
  //   "-": "COMMENT",
  //   " ": "TEXT",
  //   "\n": "TEXT",
  //   "<": "NODE_PENDING",
  //   "/": "CLOSED",
  //   DEFAULT: "NODE_VALID",
  // },
  // ATTRIBUTE: {
  //   '"': "OPENED_VALID",
  //   DEFAULT: "ATTRIBUTE",
  // },
  // OPENED_VALID: {
  //   "<": "OPENED",
  //   "/": "INDEPENDENT_VALID",
  //   ">": "OPENED_FOUND",
  //   '"': "ATTRIBUTE",
  //   DEFAULT: "OPENED_VALID",
  // },
  // CLOSED: {
  //   " ": "CONTENT",
  //   "\n": "CONTENT",
  //   "<": "OPENED",
  //   DEFAULT: "CLOSED_VALID",
  // },
  // CLOSED_VALID: {
  //   "<": "OPENED",
  //   ">": "CLOSED_FOUND",
  //   DEFAULT: "CLOSED_VALID",
  // },
  // INDEPENDENT_VALID: {
  //   "<": "OPENED",
  //   ">": "INDEPENDENT_FOUND",
  //   DEFAULT: "INDEPENDENT_VALID",
  // },
};

export { routers };

export type { CrawlStatus };
