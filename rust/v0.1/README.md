# parsley (rust)

An implementation of parsley for rust.

## How to use

`Parsley` generates steps to build a subset of xml from `template strings`;

It's used to generate static html documents and components

## Builder-ish Pattern

Provide a `Builder` and a `template string` to `parsley::parse`

```Rust
let builder = new MyBuilder();
builder = parsley::parse_str(
	builder,
	"<p>hello, {}</p>",
);
```



