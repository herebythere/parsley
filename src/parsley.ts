// brian taylor vann
// parsley - xml renderer

// N Node
// A Attributables
// P Params
// S State

import type { Hooks } from "./type_flyweight/hooks.ts";
import { Chunk } from "./chunk/chunk.ts";
import type { Position, Vector } from "./type_flyweight/text_vector.ts";
import type { Chunker } from "./type_flyweight/chunker.ts";
import type { BangerBase, ChunkBaseArray } from "./type_flyweight/chunk.ts";
import type { Draw, Template } from "./type_flyweight/template.ts";

export type {Chunker, BangerBase, ChunkBaseArray, Hooks, Position, Draw, Template, Vector}
export { Chunk };
