// brian taylor vann
// routers

type  RouterMap = Record<string, string> & {
  DEFAULT: string
}

type Routers = Record<string, RouterMap>;

const routers: Routers = {
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
    "/": "0_NODE_CLOSE",
    ">": "TEXT",
    "<": "0_NODE",
    "-": "0_COMMENT",
    DEFAULT: "0_TAGNAME",
  },
  "0_NODE_CLOSE": {
    " ": "TEXT",
    DEFAULT: "0_TAGNAME_CLOSE",
  },
  "0_TAGNAME": {
    ">": "C_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "0_INDEPENDENT_NODE",
    DEFAULT: "0_TAGNAME",
  },
  "0_TAGNAME_CLOSE": {
    ">": "C_NODE_CLOSE",
    " ": "SPACE_CLOSE_NODE",
    "\n": "SPACE_CLOSE_NODE",
    DEFAULT: "0_TAGNAME_CLOSE",
  },
  "0_INDEPENDENT_NODE": {
    ">": "C_INDEPENDENT_NODE",
    DEFAULT: "TEXT"
  },
  C_NODE: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  C_INDEPENDENT_NODE: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  C_NODE_CLOSE: {
    "<": "0_NODE",
    DEFAULT: "TEXT",
  },
  // ATTRIBUTE
  "SPACE_NODE": {
    ">": "C_NODE",
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "/": "0_INDEPENDENT_NODE",
    DEFAULT: "ATTRIBUTE", // incorrect
  },
  "ATTRIBUTE": {
    " ": "SPACE_NODE",
    "\n": "SPACE_NODE",
    "=": "ATTRIBUTE_SETTER",
    DEFAULT: "ATTRIBUTE", // incorrect
  },
  "ATTRIBUTE_SETTER": {
    "\"": "ATTRIBUTE_DECLARATION",
    "\n": "SPACE_NODE",
    DEFAULT: "SPACE_NODE",
  },
  "ATTRIBUTE_DECLARATION": {
    "\"": "C_ATTRIBUTE_VALUE",
    DEFAULT: "0_ATTRIBUTE_VALUE",
  },
  "0_ATTRIBUTE_VALUE": {
    "\"": "C_ATTRIBUTE_VALUE",
    DEFAULT: "0_ATTRIBUTE_VALUE",
  },
  "C_ATTRIBUTE_VALUE": {
    ">": "C_INDEPENDENT_NODE",
    DEFAULT: "SPACE_NODE",
  },
  // comments
  "0_COMMENT": {
    "-": "1_COMMENT",
    DEFAULT: "TEXT"
  },
  "1_COMMENT": {
    "-": "0_COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT",
  },
  TEXT_COMMENT: {
    "-": "0_COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT",
  },
  "0_COMMENT_CLOSE": {
    "-": "1_COMMENT_CLOSE",
    DEFAULT: "TEXT_COMMENT",
  },
  "1_COMMENT_CLOSE": {
    ">": "C_COMMENT",
    DEFAULT: "TEXT_COMMENT",
  },
  C_COMMENT: {
    "<": "0_NODE",
    DEFAULT: "TEXT"
  },
};

export { routers };
