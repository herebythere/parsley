// brian taylor vann
// template types

// Nodes
// Attributes
// Parameters
// State

interface Template<N, A> {
  templateArray: TemplateStringsArray;
  injections: A[];
}

export type { Template };
