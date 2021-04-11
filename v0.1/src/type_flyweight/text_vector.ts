// brian taylor vann
// text vector types

interface Position {
  arrayIndex: number;
  stringIndex: number;
}

interface Vector {
  origin: Position;
  target: Position;
}

export type { Position, Vector };
