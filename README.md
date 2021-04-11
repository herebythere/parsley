# Parsley

Dynamically maintain XML documents like [DOM](https://github.com/taylor-vann/parsley-dom).

unminimized and uncompressed < 38kb

## Install

Clone this repository and copy a version into your codebase.

#### Deno

Import `v0.1` into a deno project.

```ts
import { style } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/v0.1/src/parsley.ts";
```

## How to use

Parsley contructs interactive documents from XML. But its an ancillary library that requires an external interface.

The [hooks interface](https://github.com/taylor-vann/parsley-dom/blob/main/v0.1/src/hooks/hooks.ts) in [Parsley-dom](https://github.com/taylor-vann/parsley-dom) uses Parsley to maintain document structure.

## License

BSD 2-Clause “Simplified” License
