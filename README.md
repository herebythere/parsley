# Parsley

Build chunks of XML without dependencies.

## Abstract

Render any document structure in XML.

## How does Parsley parse XML?

Parsley linearly streams XML. It does not use ASTs. It's more akin to audio buffers and DSP.

## Notes for developers

Parsley was built to decouple XML parsing from the DOM.

XML is well suited for many kinds of document structures. However, it's usually restricted to the DOM in the browser.

I render lots of stuff in the browser that isn't DOM: audio, video, WebGL, and SVG.

Consistent multimedia experiences need document structure and could benefit from being represented in XML.

So I built Parsley to help me render whatever I want in the browser.

## License

BSD 2-Clause “Simplified” License