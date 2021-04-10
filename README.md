# Parsley

Build chunks of XML without dependencies.

unminimized and uncompressed < 39kb

## Install

Clone this repository and copy a version into your codebase.

#### Deno

Import `v0.1` into a deno project.

```ts
import { style } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/v0.1/src/parsley.ts";
```

## How to use

Parsley contructs interactive documents from XML. But its an ancillary library that requires an interface.

In [Parsley-dom](https://github.com/taylor-vann/parsley-dom), the [hooks interface](https://github.com/taylor-vann/parsley-dom/blob/main/v0.1/src/hooks/hooks.ts#L146) is an example of an interface that uses Parsley to maintain document structure.

It is an XML parser that, provided an interface, will maintain document structures.

## License

BSD 2-Clause “Simplified” License
