// brian taylor vann
// chunker

import { Template } from "./template";
import { BangerBase } from "./chunk";

interface UpdateParams<N, P, S> {
  params: P;
  state: S;
  banger: BangerBase<N>;
}

interface ConnectParams<N, P> {
  params: P;
  banger: BangerBase<N>;
}

interface RequiredChunker<N, A, P, S> {
  update: (params: UpdateParams<N, P, S>) => Template<N, A>;
  connect: (params: ConnectParams<N, P>) => S;
  disconnect: (state: S) => void;
}

type Chunker<N, A, P, S> = RequiredChunker<N, A, P, S>;

export { Chunker };
