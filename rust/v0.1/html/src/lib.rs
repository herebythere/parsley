use parsley::constants::{
    ATTRIBUTE, ATTRIBUTE_MAP_INJECTION, ATTRIBUTE_VALUE, CLOSE_TAGNAME, DESCENDANT_INJECTION,
    INDEPENDENT_NODE_CLOSED, NODE_CLOSED, TAGNAME, TEXT,
};
use parsley::parse;
use parsley::type_flyweight::{NodeStep, Results, Vector};
use std::collections::HashMap;
use std::vec;

#[derive(Debug)]
pub enum Injection<'a> {
    Text(&'a str),
    Attr(&'a str),
    AttrValue(&'a str, &'a str),
    Template(Template<'a>),
}

#[derive(Debug)]
pub struct Template<'a> {
    injections: Vec<Vec<Injection<'a>>>,
    template: &'a str,
}

pub enum StackBits<'a> {
    Template(StackBit<'a>),
    Text(&'a str),
}

pub struct StackBit<'a> {
    template: &'a Template<'a>,
    iterator: vec::IntoIter<NodeStep<'a>>,
    inj_index: usize,
}

pub struct HtmlWriter<'a> {
    html_result: String,
    builds: HashMap<String, Results<'a>>,
    tab_count: usize,
    index_count: usize,
    stack: Vec<StackBit<'a>>,
}

impl HtmlWriter<'_> {}

pub fn build<'a>(template: &'a Template) -> String {
    let mut stack = Vec::<StackBits>::new();

    // possible enum for StackBit and TextBit
    stack.push(StackBits::Template(StackBit {
        iterator: parse::parse_str(&template.template).into_iter(),
        template: template,
        inj_index: 0,
    }));

    let mut result = String::from("");
    let mut tab_count = 0;

    while stack.len() != 0 {
        let mut stack_bit = match stack.pop() {
            Some(n) => n,
            _ => return result,
        };

        match stack_bit {
            StackBits::Text(text) => {
                let text_iterator = text.split("\n");
                for text in text_iterator {
                    result.push_str(&"\t".repeat(tab_count));
                    result.push_str(text.trim());
                    result.push_str("\n");
                }
            }
            StackBits::Template(mut stack_bit) => {
                // do something
                while let Some(node_step) = stack_bit.iterator.next() {
                    match node_step.kind {
                        TAGNAME => {
                            result.push_str(&"\t".repeat(tab_count));
                            result.push_str("<");
                            result.push_str(parse::get_chunk(
                                &stack_bit.template.template,
                                &node_step.vector,
                            ));
                        }
                        NODE_CLOSED => {
                            result.push_str(">\n");
                            tab_count += 1;
                        }
                        INDEPENDENT_NODE_CLOSED => {
                            result.push_str("/>\n");
                            tab_count -= 1;
                        }
                        ATTRIBUTE => {
                            result.push_str(" ");
                            result.push_str(parse::get_chunk(
                                &stack_bit.template.template,
                                &node_step.vector,
                            ));
                        }
                        ATTRIBUTE_VALUE => {
                            result.push_str("=\"");
                            result.push_str(parse::get_chunk(
                                &stack_bit.template.template,
                                &node_step.vector,
                            ));
                            result.push_str("\"");
                        }
                        TEXT => {
                            let text_iterator =
                                parse::get_chunk(&stack_bit.template.template, &node_step.vector)
                                    .split("\n");
                            for text in text_iterator {
                                result.push_str(&"\t".repeat(tab_count));
                                result.push_str(text.trim());
                                result.push_str("\n");
                            }
                        }
                        CLOSE_TAGNAME => {
                            tab_count -= 1;
                            result.push_str(&"\t".repeat(tab_count));
                            result.push_str("</");
                            result.push_str(parse::get_chunk(
                                &stack_bit.template.template,
                                &node_step.vector,
                            ));
                            result.push_str(">\n");
                        }
                        ATTRIBUTE_MAP_INJECTION => {
                            let injections = &stack_bit.template.injections[stack_bit.inj_index];
                            stack_bit.inj_index += 1;

                            for injection in injections {
                                match injection {
                                    Injection::Attr(attr) => {
                                        result.push_str(" ");
                                        result.push_str(attr);
                                    }
                                    Injection::AttrValue(attr, value) => {
                                        result.push_str(" ");
                                        result.push_str(attr);
                                        result.push_str("=\"");
                                        result.push_str(value);
                                        result.push_str("\"");
                                    }
                                    _ => continue,
                                }
                            }
                        }
                        DESCENDANT_INJECTION => {
                            let injections = &stack_bit.template.injections[stack_bit.inj_index];
                            stack_bit.inj_index += 1;

                            stack.push(StackBits::Template(stack_bit));

                            for injection in injections.iter().rev() {
                                match injection {
                                    Injection::Text(text) => {
                                        // push text bit
                                        stack.push(StackBits::Text(text));
                                    }
                                    Injection::Template(template) => {
                                        // push template bit
                                        stack.push(StackBits::Template(StackBit {
                                            iterator: parse::parse_str(&template.template)
                                                .into_iter(),
                                            template: template,
                                            inj_index: 0,
                                        }));
                                    }
                                    _ => continue,
                                }
                            }

                            break;
                        }
                        _ => {}
                    }
                }
            }
        }
    }

    println!("{}", result);
    result
}

// standalone
pub fn html<'a>(template: &'a str, injections: Vec<Vec<Injection<'a>>>) -> Template<'a> {
    Template {
        template: template,
        injections: injections,
    }
}
