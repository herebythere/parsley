# Parsley

Dynamically maintain XML documents like
[DOM](https://github.com/taylor-vann/parsley-dom).

unminimized and uncompressed < 39kb

## TODO

** Make Template independent of render strucutre or other structures

user supplies hooks

BUILDER TO HOOKS VECTOR TO TEXT WRITER

## Abstract

Parsley is a portable meta-library that generates libraries to create different
kinds of documents!

## About

Parsley is an XML factory that generates APIs to create custom document
structures.

Parsley can build interfaces to represent:

- Screenplays
- Game Dialog
- World Objects in ThreeJS
- Geodatabase XML
- Application resources
- Historical Records
- DOM & SVG

## Install

Clone this repository and copy a version into your codebase.

#### Deno

Import `v0.1` into a deno project.

```ts
import { Chunk } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/v0.1/src/parsley.ts";
```

// N Node // A Attributables // P Params // S State

## How to use

Parsley contructs interactive documents from XML through an external interface.

The
[hooks interface](https://github.com/taylor-vann/parsley-dom/blob/main/v0.1/src/hooks/hooks.ts)
in [Parsley-dom](https://github.com/taylor-vann/parsley-dom) uses Parsley to
maintain document structure.

## Plans

Parsley is written in Typescript.

But it's a completely portable set of abstractions ready to be implemented in
other languages.

Rust and C# are the most likely next targets.

## License

BSD 3-Clause License
