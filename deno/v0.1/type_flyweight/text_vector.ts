// brian taylor vann
// text vector types

interface Position {
  x: number; // chunk
  y: number; // postition
}

interface Vector {
  origin: Position;
  target: Position;
}

export type { Position, Vector };
