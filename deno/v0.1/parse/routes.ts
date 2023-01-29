// brian taylor vann
// routes

import type { Routes } from "../type_flyweight/parse.ts";

const NODE = "NODE";
const ATTRIBUTE = "ATTRIBUTE";
const ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
const TEXT = "TEXT";
const ERROR = "ERROR";
const NODE_SPACE = "NODE_SPACE";
const NODE_CLOSED = "NODE_CLOSED";
const INDEPENDENT_NODE = "INDEPENDENT_NODE";
const INDEPENDENT_NODE_CLOSED = "INDEPENDENT_NODE_CLOSED";
const CLOSE_TAGNAME = "CLOSE_TAGNAME";

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
    "/": "CLOSE_NODE_SLASH",
    ">": ERROR,
    "-": "COMMENT_0",
    DEFAULT: "TAGNAME",
  },
  CLOSE_NODE_SLASH: {
    " ": ERROR,
    DEFAULT: CLOSE_TAGNAME,
  },
  TAGNAME: {
    ">": NODE_CLOSED,
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "/": INDEPENDENT_NODE,
    DEFAULT: "TAGNAME",
  },
  CLOSE_TAGNAME: {
    ">": "CLOSE_NODE_CLOSED",
    " ": "CLOSE_NODE_SPACE",
    "\n": "CLOSE_NODE_SPACE",
    DEFAULT: CLOSE_TAGNAME,
  },
  // close node space
  CLOSE_NODE_SPACE: {
    ">": "CLOSE_NODE_CLOSED",
    DEFAULT: "CLOSE_NODE_SPACE",
  },
  INDEPENDENT_NODE: {
    ">": INDEPENDENT_NODE_CLOSED,
    DEFAULT: INDEPENDENT_NODE,
  },
  NODE_CLOSED: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  CLOSE_NODE_CLOSED: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  INDEPENDENT_NODE_CLOSED: {
    "<": NODE,
    DEFAULT: TEXT,
  },
  // ATTRIBUTE
  NODE_SPACE: {
    ">": NODE_CLOSED,
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "/": INDEPENDENT_NODE,
    DEFAULT: ATTRIBUTE,
  },
  ATTRIBUTE: {
    " ": NODE_SPACE,
    "\n": NODE_SPACE,
    "\t": NODE_SPACE,
    "=": "ATTRIBUTE_SETTER",
    ">": NODE_CLOSED,
    "/": INDEPENDENT_NODE,
    DEFAULT: ATTRIBUTE, // incorrect
  },
  ATTRIBUTE_SETTER: {
    '"': "ATTRIBUTE_DECLARATION",
    "\n": NODE_SPACE,
    DEFAULT: NODE_SPACE,
  },
  ATTRIBUTE_DECLARATION: {
    '"': "ATTRIBUTE_DECLARATION_CLOSE",
    DEFAULT: ATTRIBUTE_VALUE,
  },
  ATTRIBUTE_VALUE: {
    '"': "ATTRIBUTE_DECLARATION_CLOSE",
    DEFAULT: ATTRIBUTE_VALUE,
  },
  ATTRIBUTE_DECLARATION_CLOSE: {
    ">": INDEPENDENT_NODE_CLOSED,
    "/": INDEPENDENT_NODE,
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
    ">": NODE_CLOSED,
    DEFAULT: "COMMENT",
  },
};

export { routes };
