use parsley::parse;
use parsley::type_flyweight::{NodeStep, Results};

//#[test]
fn parser_with_simple_attributes() {
    const template_str: &str = "<hello>{   }</hello>";
    let mut parser = parse::iter(template_str);

    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            parse::get_chunk(&template_str, &step.vector),
        );
    }
}

#[test]
fn parser_with_something_complicated_with_attributes() {
    const template_str: &str = "<p {} attr=\"{}\">{}hello{}</p>";
    let mut parser = parse::iter(template_str);

    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            parse::get_chunk(&template_str, &step.vector),
        );
    }
}

// add injection types

// descendant injection
// attribute map injection
