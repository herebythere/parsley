use parsley::parse;
use parsley::type_flyweight::{Builder, NodeStep};

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
}

#[test]
fn parse_something() {
    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "<p>{}</p>");

    println!("{:?}", builder);
}
#[test]
fn parse_something_complicated() {
    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "{}<p>{}</p>{}");

    println!("{:?}", builder);
}

#[test]
fn parse_something_complicated_with_attributes() {
    let mut builder = TestBuilder::new();

    builder = parse::parse_str(builder, "<p {} attr=\"{}\">hello</p>");

    println!("{:?}", builder);
}
