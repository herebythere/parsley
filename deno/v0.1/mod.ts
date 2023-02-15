export type { Position, Vector } from "./type_flyweight/text_vector.ts";
export type { BuilderInterface, BuildStep } from "./type_flyweight/parse.ts";

export { getText } from "./text_vector/text_vector.ts";
export { parse } from "./parse/parse.ts";
export {
	NODE,
	TAGNAME,
	ATTRIBUTE,
	ATTRIBUTE_SETTER,
	ATTRIBUTE_DECLARATION,
	ATTRIBUTE_VALUE,
	ATTRIBUTE_DECLARATION_CLOSE,
	TEXT,
	ERROR,
	NODE_SPACE,
	NODE_CLOSED,
	INDEPENDENT_NODE,
	INDEPENDENT_NODE_CLOSED,
	CLOSE_NODE_SLASH,
	CLOSE_TAGNAME,
	CLOSE_NODE_SPACE,
	CLOSE_NODE_CLOSED,
} from "./type_flyweight/parse.ts";
