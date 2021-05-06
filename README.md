# Parsley

Dynamically maintain XML documents like [DOM](https://github.com/taylor-vann/parsley-dom).

unminimized and uncompressed < 40kb

## Abstract

Parsley is a portable library that generates libraries to create documents!

It's an XML factory that will, provided an interface, generate an API to maintain custom document structures.

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

## How to use

Parsley contructs interactive documents from XML through an external interface.

The [hooks interface](https://github.com/taylor-vann/parsley-dom/blob/main/v0.1/src/hooks/hooks.ts) in [Parsley-dom](https://github.com/taylor-vann/parsley-dom) uses Parsley to maintain document structure.

## Plans

Currently Parsley is written in Typescript. But it's a completely portable set of abstractions.

## License

BSD 2-Clause “Simplified” License
