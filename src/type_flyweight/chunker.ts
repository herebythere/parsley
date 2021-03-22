// brian taylor vann
// chunker

import { Template } from "./template.ts";
import { BangerBase } from "./chunk.ts";

interface UpdateParams<N, P, S> {
  params: P;
  state: S;
  banger: BangerBase<N>;
}

interface ConnectParams<N, P> {
  params: P;
  banger: BangerBase<N>;
}

interface DisconnectParams<S> {
  state: S;
}

type UpdateChunk<N, A, P, S> = (
  params: UpdateParams<N, P, S>
) => Template<N, A>;

type ConnectChunk<N, P, S> = (params: ConnectParams<N, P>) => S;
type DisconnectChunk<S> = (params: DisconnectParams<S>) => void;

interface RequiredChunker<N, A, P, S> {
  update: UpdateChunk<N, A, P, S>;
  connect: ConnectChunk<N, P, S>;
  disconnect: DisconnectChunk<S>;
}

type Chunker<N, A, P, S> = RequiredChunker<N, A, P, S>;

export type {
  Chunker,
  ConnectParams,
  UpdateChunk,
  ConnectChunk,
  DisconnectChunk,
};
