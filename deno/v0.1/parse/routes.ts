import type { Routes } from "../type_flyweight/parse.ts";

import {
  ATTRIBUTE,
  ATTRIBUTE_DECLARATION,
  ATTRIBUTE_DECLARATION_CLOSE,
  ATTRIBUTE_SETTER,
  ATTRIBUTE_VALUE,
  CLOSE_NODE_CLOSED,
  CLOSE_NODE_SLASH,
  CLOSE_NODE_SPACE,
  CLOSE_TAGNAME,
  DEFAULT,
  ERROR,
  INDEPENDENT_NODE,
  INDEPENDENT_NODE_CLOSED,
  INITIAL,
  NODE,
  NODE_CLOSED,
  NODE_SPACE,
  TAGNAME,
  TEXT,
} from "../type_flyweight/constants.ts";

const INIITAL_MAP = new Map<string, string>([
  ["<", NODE],
  [DEFAULT, TEXT],
]);

const NODE_MAP = new Map<string, string>([
  [" ", ERROR],
  ["\n", ERROR],
  ["\t", ERROR],
  ["/", CLOSE_NODE_SLASH],
  [">", ERROR],
  [DEFAULT, TAGNAME],
]);

const CLOSE_NODE_SLASH_MAP = new Map<string, string>([
  [" ", ERROR],
  ["\n", ERROR],
  ["\t", ERROR],
  [DEFAULT, CLOSE_TAGNAME],
]);

const TAGNAME_MAP = new Map<string, string>([
  [">", NODE_CLOSED],
  [" ", NODE_SPACE],
  ["\n", NODE_SPACE],
  ["\t", NODE_SPACE],
  ["/", INDEPENDENT_NODE],
  [DEFAULT, TAGNAME],
]);

const CLOSE_TAGNAME_MAP = new Map<string, string>([
  [">", CLOSE_NODE_CLOSED],
  [" ", CLOSE_NODE_SPACE],
  ["\n", CLOSE_NODE_SPACE],
  ["\t", CLOSE_NODE_SPACE],
  [DEFAULT, CLOSE_TAGNAME],
]);

const CLOSE_NODE_SPACE_MAP = new Map<string, string>([
  [">", CLOSE_NODE_CLOSED],
  [DEFAULT, CLOSE_NODE_SPACE],
]);

const INDEPENDENT_NODE_MAP = new Map<string, string>([
  [">", INDEPENDENT_NODE_CLOSED],
  [DEFAULT, INDEPENDENT_NODE],
]);

const NODE_SPACE_MAP = new Map<string, string>([
  [">", NODE_CLOSED],
  [" ", NODE_SPACE],
  ["\n", NODE_SPACE],
  ["\t", NODE_SPACE],
  ["/", INDEPENDENT_NODE],
  [DEFAULT, ATTRIBUTE],
]);

const ATTRIBUTE_MAP = new Map<string, string>([
  [" ", NODE_SPACE],
  ["\n", NODE_SPACE],
  ["\t", NODE_SPACE],
  ["=", ATTRIBUTE_SETTER],
  [">", NODE_CLOSED],
  ["/", INDEPENDENT_NODE],
  [DEFAULT, ATTRIBUTE],
]);

const ATTRIBUTE_SETTER_MAP = new Map<string, string>([
  ['"', ATTRIBUTE_DECLARATION],
  ["\n", NODE_SPACE],
  [DEFAULT, NODE_SPACE],
]);

const ATTRIBUTE_DECLARATION_MAP = new Map<string, string>([
  ['"', ATTRIBUTE_DECLARATION_CLOSE],
  [DEFAULT, ATTRIBUTE_VALUE],
]);

const ATTRIBUTE_VALUE_MAP = new Map<string, string>([
  ['"', ATTRIBUTE_DECLARATION_CLOSE],
  [DEFAULT, ATTRIBUTE_VALUE],
]);

const ATTRIBUTE_DECLARATION_CLOSE_MAP = new Map<string, string>([
  [">", INDEPENDENT_NODE_CLOSED],
  ["/", INDEPENDENT_NODE],
  [DEFAULT, NODE_SPACE],
]);

const routes = new Map<string, Map<string, string>>([
  [INITIAL, INIITAL_MAP],
  [TEXT, INIITAL_MAP],
  [NODE, NODE_MAP],
  [CLOSE_NODE_SLASH, CLOSE_NODE_SLASH_MAP],
  [TAGNAME, TAGNAME_MAP],
  [CLOSE_TAGNAME, CLOSE_TAGNAME_MAP],
  [CLOSE_NODE_SPACE, CLOSE_NODE_SPACE_MAP],
  [INDEPENDENT_NODE, INDEPENDENT_NODE_MAP],
  [NODE_CLOSED, INIITAL_MAP],
  [CLOSE_NODE_CLOSED, INIITAL_MAP],
  [INDEPENDENT_NODE_CLOSED, INIITAL_MAP],
  [NODE_SPACE, NODE_SPACE_MAP],
  [ATTRIBUTE, ATTRIBUTE_MAP],
  [ATTRIBUTE_SETTER, ATTRIBUTE_SETTER_MAP],
  [ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_MAP],
  [ATTRIBUTE_VALUE, ATTRIBUTE_VALUE_MAP],
  [ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_DECLARATION_CLOSE_MAP],
]);

export { routes };
