// brian taylor vann
// skeleton routers

import { CrawlStatus } from "../../type_flyweight/skeleton_crawl.ts";

type Routes = Record<string, CrawlStatus>;
type Routers = Partial<Record<CrawlStatus, Routes>>;

const routers: Routers = {
  CONTENT: {
    "<": "OPENED",
    DEFAULT: "CONTENT",
  },
  OPENED: {
    " ": "CONTENT",
    "\n": "CONTENT",
    "<": "OPENED",
    "/": "CLOSED",
    DEFAULT: "OPENED_VALID",
  },
  ATTRIBUTE: {
    "\\": "ATTRIBUTE_ESC_CHAR",
    '"': "OPENED_VALID",
    DEFAULT: "ATTRIBUTE",
  },
  ATTRIBUTE_ESC_CHAR: {
    DEFAULT: "ATTRIBUTE",
  },
  OPENED_VALID: {
    "<": "OPENED",
    "/": "INDEPENDENT_VALID",
    ">": "OPENED_FOUND",
    '"': "ATTRIBUTE",
    DEFAULT: "OPENED_VALID",
  },
  CLOSED: {
    " ": "CONTENT",
    "\n": "CONTENT",
    "<": "OPENED",
    DEFAULT: "CLOSED_VALID",
  },
  CLOSED_VALID: {
    "<": "OPENED",
    ">": "CLOSED_FOUND",
    DEFAULT: "CLOSED_VALID",
  },
  INDEPENDENT_VALID: {
    "<": "OPENED",
    ">": "INDEPENDENT_FOUND",
    DEFAULT: "INDEPENDENT_VALID",
  },
};

export { routers };

export type { CrawlStatus };
