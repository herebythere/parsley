use parsley::parse;
use parsley::type_flyweight::{NodeStep, Results};

#[test]
fn parse_with_simple_attributes() {
    const template_str: &str = "<hello>{   }</hello>";

    let steps = parse::parse_str(template_str);
    println!("{:?}", steps);
}

//#[test]
fn parse_with_something_complicated_with_attributes() {
    const template_str: &str = "<p {} attr=\"howdy!\">{}hello{}</p>";

    let steps = parse::parse_str(template_str);
    println!("{:?}", steps);
}
