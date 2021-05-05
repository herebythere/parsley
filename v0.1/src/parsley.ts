// brian taylor vann
// parsley - xml renderer

// N Node
// A Attributables
// P Params
// S State

export type {
  BangerBase,
  ChunkBase,
  ChunkEffect,
} from "./type_flyweight/chunk.ts";

export type {
  Attach,
  ChunkBaseArray,
  Chunker,
  Compose,
  ConnectChunk,
  ConnectParams,
  ContextFactory,
  DisconnectChunk,
  UpdateChunk,
} from "./type_flyweight/chunker.ts";

export type {
  CreateNode,
  CreateTextNode,
  GetSibling,
  Hooks,
  InsertDescendant,
  RemoveDescendant,
  SetAttribute,
  SetAttributeParams,
} from "./type_flyweight/hooks.ts";

export type { Draw, Template } from "./type_flyweight/template.ts";

export { Chunk } from "./chunk/chunk.ts";
