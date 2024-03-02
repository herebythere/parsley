use parsley::parse;
use parsley::type_flyweight::{NodeStep, Results};

#[test]
fn parser_with_simple_attributes() {
    const template: &str = "<hello>{   }</hello>";
    let mut parser = parse::StringIterator::new(template);

    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            &template[step.vector.origin..step.vector.target]
        );
    }
}

#[test]
fn parser_with_something_complicated_with_attributes() {
    const template: &str = "<p {} attr=\"{}\">hello</p>";
    let mut parser = parse::StringIterator::new("<p {} attr=\"{}\">hello</p>");

    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            &template[step.vector.origin..step.vector.target]
        );
    }
}
