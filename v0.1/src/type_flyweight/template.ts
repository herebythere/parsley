// brian taylor vann
// template types

// Nodes
// Attributes
// Parameters
// State


interface Chunk<N> {
  children: N[];
}

type AttributeValue<N, A> =
  | A
  | Chunk<N>
  | string
  | boolean
  | undefined;

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: AttributeValue<N, A>[];
}

type Attach<N> = (parentNode: N, chunk: Chunk<N>) => void;

// type Compose<N, A> = <P = void, S = void>(
//   chunker: Chunker<N, A, P, S>,
// ) => ChunkFactory<N, P>;

type Draw<N, A> = (
  templateArray: TemplateStringsArray,
  ...injections: AttributeValue<N, A>[]
) => Template<N, A>;

export type { Attach, AttributeValue, Draw, Template };
