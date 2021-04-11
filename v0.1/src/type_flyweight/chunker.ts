// brian taylor vann
// chunker types

import { Template } from "./template.ts";
import { ChunkBase, BangerBase } from "./chunk.ts";

interface UpdateParams<N, P, S> {
  params: P;
  state: S;
  banger: BangerBase<N>;
}
type UpdateChunk<N, A, P, S> = (
  params: UpdateParams<N, P, S>
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
type ContextFactory<N, P> = (params: P) => ChunkBase<N>;

type Compose<N, A> = <P = void, S = void>(
  chunker: Chunker<N, A, P, S>
) => ContextFactory<N, P>;

type ChunkBaseArray<N> = ChunkBase<N>[];
type Attach<N> = (parentNode: N, chunkArray: ChunkBaseArray<N>) => void;

export type {
  Attach,
  Chunker,
  ChunkBaseArray,
  Compose,
  ConnectChunk,
  ConnectParams,
  ContextFactory,
  DisconnectChunk,
  UpdateChunk,
};
