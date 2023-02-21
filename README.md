# Parsley

A good enough XML parser

## About

Parsley deserializes a subset of xml to build documents from custom xml
languages.

## Install

### Deno

```ts
import {
  getText,
  parse,
} from "https://raw.githubusercontent.com/herebythere/parsley/main/deno/v0.1/mod.ts";
```

### EMCAScript

```js
import {
  getText,
  parse,
} from "https://raw.githubusercontent.com/herebythere/parsley/main/es/v0.1/parsley.ts";
```

## How to use

### Templates

A template is an array of strings:

```
Template: []string
```

### Builder

Parsely relies on a user provided `Builder` structure with the following api:

```
Builder {
	push(step: BuildStep) {
		... react to build step
	}
}
```

### Parse

Pass a `Template` and a `Builder` to `parse`.

Every build step in a `Template` is passed as an agurment to `Builder.push()`
until the template is successfully parsed or an error is found.

```
parse(
	template: Template,
	builder: Builder,
): void
```

### Injections

The following template demonstrates three valid injections:

String interpolation:

```
["<element", "/>", "</element>"]
```

String formatting:

```
"<element %s />%s</element>"
```

### Limitations

Parsley provides limited support for xml syntax:

- comments are not supported
- misplaced template injections are ignored

## License

Parsley is released under the BSD 3-Clause License
