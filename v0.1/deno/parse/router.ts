// brian taylor vann
// routers

type RouterMap = Record<string, string> & {
  DEFAULT: string
}

type Routers = Record<string, RouterMap>;

const routers: Routers = {
  INITIAL: {
    "<": "NODE",
    DEFAULT: "TEXT"
  },
  // TEXT
  TEXT: {
    "<": "NODE",
    DEFAULT: "TEXT",
  },
  // NODE
  NODE: {
    " ": "NODE",
    "\n": "NODE",
    "/": "NODE_CLOSE",
    ">": "ERROR",
    "-": "COMMENT_0",
    DEFAULT: "TAGNAME",
  },
  NODE_CLOSE: {
    " ": "NODE_CLOSE",
    DEFAULT: "TAGNAME_CLOSE",
  },
  TAGNAME: {
    ">": "CLOSE_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "INDEPENDENT_NODE",
    DEFAULT: "TAGNAME",
  },
  TAGNAME_CLOSE: {
    ">": "CLOSE_NODE",
    " ": "SPACE_CLOSE_NODE",
    "\n": "SPACE_CLOSE_NODE",
    DEFAULT: "TAGNAME_CLOSE",
  },
  INDEPENDENT_NODE: {
    ">": "CLOSE_INDEPENDENT_NODE",
    DEFAULT: "INDEPENDENT_NODE"
  },
  CLOSE_NODE: {
    "<": "NODE",
    DEFAULT: "TEXT",
  },
  CLOSE_INDEPENDENT_NODE: {
    "<": "NODE",
    DEFAULT: "TEXT",
  },
  // ATTRIBUTE
  SPACE_NODE: {
    ">": "CLOSE_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "INDEPENDENT_NODE",
    DEFAULT: "ATTRIBUTE",
  },
  ATTRIBUTE: {
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "=": "ATTRIBUTE_SETTER",
    ">": "CLOSE_NODE",
    DEFAULT: "ATTRIBUTE", // incorrect
  },
  ATTRIBUTE_SETTER: {
    "\"": "ATTRIBUTE_DECLARATION",
    "\n": "SPACE_NODE",
    DEFAULT: "SPACE_NODE",
  },
  ATTRIBUTE_DECLARATION: {
    "\"": "CLOSE_ATTRIBUTE_DECLARATION",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  ATTRIBUTE_VALUE: {
    "\"": "CLOSE_ATTRIBUTE_DECLARATION",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  CLOSE_ATTRIBUTE_DECLARATION: {
    ">": "CLOSE_INDEPENDENT_NODE",
    DEFAULT: "SPACE_NODE",
  },
  // comments
  COMMENT_0: {
    "-": "COMMENT_1",
    DEFAULT: "ERROR"
  },
  COMMENT_1: {
    "-": "COMMENT_CLOSE",
    DEFAULT: "COMMENT",
  },
  COMMENT: {
    "-": "COMMENT_CLOSE",
    DEFAULT: "COMMENT",
  },
  COMMENT_CLOSE: {
    "-": "COMMENT_CLOSE_1",
    DEFAULT: "ERROR",
  },
  COMMENT_CLOSE_1: {
    ">": "CLOSE_NODE",
    DEFAULT: "COMMENT",
  },
};

export { routers };
