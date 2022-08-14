// brian taylor vann
// hook types

type SetAttribute<N, A> = (
  node: N,
  attribute: string,
  value: A,
) => void;

type CreateNode<N> = (tag: string) => N;
type CreateTextNode<N> = (content: string) => N;

type InsertDescendant<N> = (
  descendant: N,
  parentNode?: N,
  leftNode?: N,
) => void;

type RemoveDescendant<N> = (descendant: N) => N | undefined;
type GetSibling<N> = (descendant: N) => (N | undefined)[];

interface Hooks<N, A> {
  createNode: CreateNode<N>;
  createTextNode: CreateTextNode<N>;
  getSiblings: GetSibling<N>;
  insertDescendant: InsertDescendant<N>;
  removeAttribute: SetAttribute<N, A>;
  removeDescendant: RemoveDescendant<N>;
  setAttribute: SetAttribute<N, A>;
}

export type {
  CreateNode,
  CreateTextNode,
  GetSibling,
  Hooks,
  InsertDescendant,
  RemoveDescendant,
  SetAttribute,
};
