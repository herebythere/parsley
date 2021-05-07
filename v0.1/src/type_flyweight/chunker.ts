// brian taylor vann
// chunker types

// Nodes
// Attributes
// Parameters
// State

import type { Template } from "./template.ts";
import type { BangerBase, ChunkBase } from "./chunk.ts";

interface UpdateParams<N, P, S> {
  params: P;
  state: S;
  banger: BangerBase<N>;
}
type UpdateChunk<N, A, P, S> = (
  params: UpdateParams<N, P, S>,
) => Template<N, A>;

interface ConnectParams<N, P> {
  params: P;
  banger: BangerBase<N>;
}
type ConnectChunk<N, P, S> = (params: ConnectParams<N, P>) => S;

interface DisconnectParams<S> {
  state: S;
}
type DisconnectChunk<S> = (params: DisconnectParams<S>) => void;

interface RequiredChunker<N, A, P, S> {
  update: UpdateChunk<N, A, P, S>;
  connect: ConnectChunk<N, P, S>;
  disconnect: DisconnectChunk<S>;
}

type Chunker<N, A, P, S> = RequiredChunker<N, A, P, S>;
type ChunkFactory<N, P> = (params: P) => ChunkBase<N>;

type ChunkBaseArray<N> = ChunkBase<N>[];

export type {
  ChunkBaseArray,
  Chunker,
  ChunkFactory,
  ConnectChunk,
  ConnectParams,
  DisconnectChunk,
  UpdateChunk,
};
