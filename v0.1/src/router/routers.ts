// brian taylor vann
// routers

const routers = {
  INITIAL: {
    "<": "0_NODE",
    DEFAULT: "TEXT"
  },
  // TEXT
  TEXT: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  // NODE
  "0_NODE": {
    " ": "TEXT",
    "\n": "TEXT",
    "/": "TEXT",
    ">": "TEXT",
    "<": "0_NODE",
    "-": "0_COMMENT",
    DEFAULT: "0_TAGNAME",
  },
  "0_TAGNAME": {
    ">": "C_NODE",
    " ": "SPACE_ATTRIBUTE",
    "/": "0_INDEPENDENT_NODE",
    DEFAULT: "0_TAGNAME",
  },
  "0_INDEPENDENT_NODE": {
    " ": "SPACE_ATTRIBUTE",
    ">": "C_INDEPENDENT_NODE",
    DEFAULT: "SPACE_ATTRIBUTE" // incorrect for now
  },
  C_NODE: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  C_INDEPENDENT_NODE: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  // ATTRIBUTE
  "SPACE_ATTRIBUTE": {
    ">": "C_NODE",
    DEFAULT: "SPACE_ATTRIBUTE", // incorrect
  },
  // comments
  "0_COMMENT": {
    "-": "1_COMMENT",
    DEFAULT: "TEXT"
  },
  "1_COMMENT": {
    "-": "0_COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT"
  },
  TEXT_COMMENT: {
    "-": "0_COMMENT_CLOSE",
  },
  "0_COMMENT_CLOSE": {
    "-": "1_COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT"
  },
  "1_COMMENT_CLOSE": {
    ">": "C_COMMENT",
    DEFAULT: "TEXT_COMMENT"
  },
  C_COMMENT: {
    "<": "0_NODE",
    DEFAULT: "TEXT"
  }
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
} as const;

export { routers };

// export type { CrawlStatus };
