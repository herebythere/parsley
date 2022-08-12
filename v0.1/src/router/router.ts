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
    " ": "TEXT",
    "\n": "TEXT",
    "/": "NODE_CLOSE",
    ">": "TEXT",
    "-": "COMMENT",
    DEFAULT: "TAGNAME",
  },
  NODE_CLOSE: {
    " ": "TEXT",
    DEFAULT: "TAGNAME_CLOSE",
  },
  TAGNAME: {
    ">": "C_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "INDEPENDENT_NODE",
    DEFAULT: "TAGNAME",
  },
  TAGNAME_CLOSE: {
    ">": "C_NODE",
    " ": "SPACE_CLOSE_NODE",
    "\n": "SPACE_CLOSE_NODE",
    DEFAULT: "TAGNAME_CLOSE",
  },
  INDEPENDENT_NODE: {
    ">": "C_INDEPENDENT_NODE",
    DEFAULT: "INDEPENDENT_NODE"
  },
  C_NODE: {
    "<": "NODE",
    DEFAULT: "TEXT",
  },
  C_INDEPENDENT_NODE: {
    "<": "NODE",
    DEFAULT: "TEXT",
  },
  // ATTRIBUTE
  SPACE_NODE: {
    ">": "C_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "INDEPENDENT_NODE",
    DEFAULT: "ATTRIBUTE",
  },
  ATTRIBUTE: {
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "=": "ATTRIBUTE_SETTER",
    ">": "C_NODE",
    DEFAULT: "ATTRIBUTE", // incorrect
  },
  ATTRIBUTE_SETTER: {
    "\"": "ATTRIBUTE_DECLARATION",
    "\n": "SPACE_NODE",
    DEFAULT: "SPACE_NODE",
  },
  ATTRIBUTE_DECLARATION: {
    "\"": "C_ATTRIBUTE_VALUE",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  ATTRIBUTE_VALUE: {
    "\"": "C_ATTRIBUTE_VALUE",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  C_ATTRIBUTE_VALUE: {
    ">": "C_INDEPENDENT_NODE",
    DEFAULT: "SPACE_NODE",
  },
  // comments
  COMMENT: {
    "-": "COMMENT_1",
    DEFAULT: "TEXT"
  },
  COMMENT_1: {
    "-": "COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT",
  },
  TEXT_COMMENT: {
    "-": "COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT",
  },
  COMMENT_CLOSE: {
    "-": "COMMENT_CLOSE_1",
    DEFAULT: "TEXT_COMMENT",
  },
  COMMENT_CLOSE_1: {
    ">": "C_COMMENT",
    DEFAULT: "TEXT_COMMENT",
  },
  C_COMMENT: {
    "<": "NODE",
    DEFAULT: "TEXT"
  },
};

export { routers };
