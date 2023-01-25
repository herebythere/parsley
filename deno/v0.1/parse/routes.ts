// brian taylor vann
// routers

import type { Routes } from "../type_flyweight/parse.ts";

const NODE = "NODE";
const TEXT = "TEXT";
const ERROR = "ERROR";
const NODE_SPACE = "NODE_SPACE";
const NODE_CLOSE = "NODE_CLOSE";

const routes: Routes = {
  INITIAL: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  // TEXT
  TEXT: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  // NODE
  NODE: {
    " ": ERROR,
    "\n": NODE,
    "\t": NODE,
    "/": "NODE_CLOSER",
    ">": ERROR,
    "-": "COMMENT_0",
    DEFAULT: "TAGNAME",
  },
  NODE_CLOSER: {
    " ": ERROR,
    DEFAULT: "TAGNAME_CLOSE",
  },
  TAGNAME: {
    ">": NODE_CLOSE,
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "/": "INDEPENDENT_NODE",
    DEFAULT: "TAGNAME",
  },
  TAGNAME_CLOSE: {
    ">": "CLOSE_NODE_CLOSER",
    " ": "SPACE_CLOSE_NODE",
    "\n": "SPACE_CLOSE_NODE",
    DEFAULT: "TAGNAME_CLOSE",
  },
  INDEPENDENT_NODE: {
    ">": "CLOSE_INDEPENDENT_NODE",
    DEFAULT: "INDEPENDENT_NODE",
  },
  NODE_CLOSE: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  CLOSE_NODE_CLOSER: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  CLOSE_INDEPENDENT_NODE: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  // ATTRIBUTE
  NODE_SPACE: {
    ">": NODE_CLOSE,
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "/": "INDEPENDENT_NODE",
    DEFAULT: "ATTRIBUTE",
  },
  ATTRIBUTE: {
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "=": "ATTRIBUTE_SETTER",
    ">": NODE_CLOSE,
    "/": "INDEPENDENT_NODE",
    DEFAULT: "ATTRIBUTE", // incorrect
  },
  ATTRIBUTE_SETTER: {
    '"': "ATTRIBUTE_DECLARATION",
    "\n": NODE_SPACE,
    DEFAULT: NODE_SPACE,
  },
  ATTRIBUTE_DECLARATION: {
    '"': "CLOSE_ATTRIBUTE_DECLARATION",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  ATTRIBUTE_VALUE: {
    '"': "CLOSE_ATTRIBUTE_DECLARATION",
    DEFAULT: "ATTRIBUTE_VALUE",
  },
  CLOSE_ATTRIBUTE_DECLARATION: {
    ">": "CLOSE_INDEPENDENT_NODE",
    "/": "INDEPENDENT_NODE",
    DEFAULT: NODE_SPACE,
  },
  // comments
  COMMENT_0: {
    "-": "COMMENT_1",
    DEFAULT: ERROR,
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
    DEFAULT: ERROR,
  },
  COMMENT_CLOSE_1: {
    ">": NODE_CLOSE,
    DEFAULT: "COMMENT",
  },
};

export { routes };
