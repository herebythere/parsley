use parsley::parse;
use parsley::type_flyweight::{NodeStep, Results};

//#[test]
fn parse_with_simple_attributes() {
    const template_str: &str = "<hello>{   }</hello>";

    let source = Vec::<NodeStep>::from([]);

    let target = Vec::<NodeStep>::new();
    let mut parser = parse::iter(template_str);
    while let Some(step) = parser.next() {
        /*
        println!(
            "{:?}\n{}\n",
            step,
            parse::get_chunk(&template_str, &step.vector),
        );
        */
    }
    
    let steps = parse::parse_steps(template_str);
    println!("{:?}", steps);
}

#[test]
fn parse_with_something_complicated_with_attributes() {
    const template_str: &str = "<p {} attr=\"howdy!\">{}hello{}</p>";

    let mut parser = parse::iter(template_str);
    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            parse::get_chunk(&template_str, &step.vector),
        );
    }
}
