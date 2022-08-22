// brian taylor vann
// template types

// Nodes
// Attributes
// Parameters
// State

interface Chunk<N> {
  children: N[];
}

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: A[];
}

type Attach<N> = (parentNode: N, chunk: Chunk<N>) => void;

// type Compose<N, A> = <P = void, S = void>(
//   chunker: Chunker<N, A, P, S>,
// ) => ChunkFactory<N, P>;

type Draw<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

export type { Attach, Draw, Template };
