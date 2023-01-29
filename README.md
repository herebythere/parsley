# Parsley

XML parser

## About

Parsley provides the build steps of an xml document.

It helps build documents from custom xml langauges.

## Install

Clone this repository and copy a version into your codebase.

### Deno

```ts
import { parse } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/deno/v0.1/mod.ts";
```

## How to use

Parsely relies on three interfaces:

- `Template` has properties
- `Builder` accepts build steps and
- `Delta`

### Templates

Parsley expects an template interface including an array of xml and an array of
injections.

```
Template {
	template: []string
	injections: []unknown
}
```

### Builder

Parsley uses a builder interface to

```
Builder {
	push(step: BuildStep) {
		...
	}
}
```

### Parse

```
parse(
	template: Template,
	builder: Builder,
	delta: Delta,
): void
```

## License

BSD 3-Clause License
