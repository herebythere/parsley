use parsley::parse;
use parsley::type_flyweight::{Builder, NodeStep, Results};

#[derive(Debug)]
pub struct TestBuilder {
    pub node_steps: Vec<NodeStep>,
}

impl TestBuilder {
    fn new() -> TestBuilder {
        TestBuilder {
            node_steps: Vec::new(),
        }
    }
}

impl Builder for TestBuilder {
    fn add_step(mut self, step: NodeStep) -> TestBuilder {
        self.node_steps.push(step);
        self
    }

    fn build(self) -> Results {
        self.node_steps
    }
}

// #[test]
fn parse_something() {
    let control_builder = TestBuilder::new();

    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "<p>{}</p>");

    // println!("{:?}", builder);
}
// #[test]
fn parse_something_complicated() {
    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "{}<p>{}</p>{}");

    // println!("{:?}", builder);
}

// #[test]
fn parse_something_complicated_with_attributes() {
    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "<p {} attr=\"{}\">hello</p>");

    // println!("{:?}", builder);
}

#[test]
fn parser_with_simple_attributes() {
    let mut builder = TestBuilder::new();
    const template: &str = "<hello>howdy</hello>";
    let mut parser = parse::StringIterator::new(template);

    while let Some(step) = parser.next() {
        println!(
            "{:?}\n{}\n",
            step,
            &template[step.vector.origin..step.vector.target]
        );
    }
}

// #[test]
fn parser_with_something_complicated_with_attributes() {
    let mut builder = TestBuilder::new();
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
