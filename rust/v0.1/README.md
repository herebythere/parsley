Rust does not have string literals in the same manner as Javascript and C#.

"\<p>{}</p>"
"\<p>^</p>"
"\<p>#</p>"
"\<p>&</p>"

Need to deliberate how to translate between them later

With rust they could be separate files

Read / generate into template string arrays [] with serde

Intention is for small components to build to larger applications

So do we use `bufreaders` or a `read to string` to pass

Approaching both with the same logic might be a red flag

there should be a `parse_str` or a `parse_reader` function

each should handle the type

and each should apply similar logic to the input

but the input shouldn't accomodate both


parse(builder, template, injections)

A builder pattern might be passed a template

// the builder could handle the injections?
