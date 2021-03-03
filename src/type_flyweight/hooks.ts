// brian taylor vann
// hooks

import { AttributeValue } from "./template";
import {ReferenceMap} from "./render";

interface SetAttributeParams<N, A> {
  references: ReferenceMap<N>;
  attribute: string;
  node: N;
  value: AttributeValue<N, A>;
}

type SetAttribute<N, A> = (params: SetAttributeParams<N, A>) => void;
type CreateNode<N> = (tag: string) => N;
type CreateTextNode<N> = (content: string) => N;

interface InsertDescendantParams<N> {
  descendant: N;
  leftNode?: N;
  parentNode?: N;
}

type InsertDescendant<N> = (params: InsertDescendantParams<N>) => void;
type RemoveDescendant<N> = (descendant: N) => N | undefined;
type GetSibling<N> = (descendant: N) => N | undefined;

interface Hooks<N, A> {
  createNode: CreateNode<N>;
  createTextNode: CreateTextNode<N>;
  getSibling: GetSibling<N>;
  insertDescendant: InsertDescendant<N>;
  removeAttribute: SetAttribute<N, A>;
  removeDescendant: RemoveDescendant<N>;
  setAttribute: SetAttribute<N, A>;
}

export {
  CreateNode,
  CreateTextNode,
  GetSibling,
  Hooks,
  InsertDescendant,
  RemoveDescendant,
  SetAttribute,
  SetAttributeParams,
};
