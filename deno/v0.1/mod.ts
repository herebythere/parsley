export type { Position, Vector } from "./type_flyweight/text_vector.ts";
export type { BuilderInterface, BuildStep } from "./type_flyweight/parse.ts";

export { getText } from "./text_vector/text_vector.ts";
export { parse } from "./parse/parse.ts";
export {
  ATTRIBUTE,
  ATTRIBUTE_DECLARATION,
  ATTRIBUTE_DECLARATION_CLOSE,
  ATTRIBUTE_SETTER,
  ATTRIBUTE_VALUE,
  CLOSE_NODE_CLOSED,
  CLOSE_NODE_SLASH,
  CLOSE_NODE_SPACE,
  CLOSE_TAGNAME,
  ERROR,
  INDEPENDENT_NODE,
  INDEPENDENT_NODE_CLOSED,
  NODE,
  NODE_CLOSED,
  NODE_SPACE,
  TAGNAME,
  TEXT,
} from "./type_flyweight/parse.ts";
