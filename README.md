# Parsley

A good enough XML parser

## About

Parsley deserializes a subset of xml to build documents from custom xml languages.

## Install

### Deno

```ts
import { parse, getText } from "https://raw.githubusercontent.com/herebythere/parsley/main/deno/v0.1/mod.ts";
```

### EMCAScript

```js
import { parse, getText } from "https://raw.githubusercontent.com/herebythere/parsley/main/es/v0.1/parsley.ts";
```

## How to use

### Templates

Every build step in a `Template` is passed as an agurment to `Builder.step()` until an error is found.

A template is simply an array of strings:

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

Every build step in a `Template` is passed as an agurment to `Builder.push()` until the template is successfully parsed or an error is found.

```
parse(
	template: Template,
	builder: Builder,
): void
```

### Limitations

Parsley provides limited support for xml syntax:

- comments are not supported
- misplaced template injections are ignored

As in, the following template demonstrates three valid injections:

String interpolation:

```
["<element", "attribute=", "/>", "</element>"]
}
```

String formatting:

```
"<element %s attribute="%s"/>%s</element>"
```

## License

BSD 3-Clause License
