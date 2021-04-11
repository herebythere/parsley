// brian taylor vann
// parsley - xml renderer

// N Node
// A Attributables
// P Params
// S State

export type { Hooks } from "./type_flyweight/hooks.ts";
export type { Position, Vector } from "./type_flyweight/text_vector.ts";
export type {
  Chunker,
  Compose,
  ConnectChunk,
  ConnectParams,
  ContextFactory,
  DisconnectChunk,
  UpdateChunk,
} from "./type_flyweight/chunker.ts";
export type {
  Attach,
  BangerBase,
  ChunkBaseArray,
  ChunkEffect,
  EffectQuality,
} from "./type_flyweight/chunk.ts";
export type { Draw, Template } from "./type_flyweight/template.ts";

export { Chunk } from "./chunk/chunk.ts";
