// brian taylor vann
// template types

// Nodes
// Attributes
// Parameters
// State

interface Template<I> {
  templateArray: TemplateStringsArray;
  injections: I[];
}

export type { Template };
