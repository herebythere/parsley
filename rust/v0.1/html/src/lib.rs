// start with string, load file next

// go over with iterator

// output to file

// keep track of tabs
// remove whitespace cruft
// outputing

// "<hello>{}</hello>", world

//
use parsley::constants::{
    ATTRIBUTE, ATTRIBUTE_VALUE, CLOSE_TAGNAME, INJECTION_FOUND, NODE_CLOSED, TAGNAME, TEXT,
};
use parsley::parse::{get_injection_type, StringIterator};
use parsley::type_flyweight::{Results, Vector};
use std::collections::HashMap;

#[derive(Clone, Debug)]
pub enum Injection<'a> {
    Str(&'a str),
    VecString(Vec<String>),
    VecStringTuple(Vec<(String, String)>),
    Template(Template<'a>),
}

#[derive(Clone, Debug)]
pub struct Template<'a> {
    injections: Vec<Injection<'a>>,
    template: &'a str,
}

pub struct StackBit<'a> {
    template: &'a Template<'a>,
    iterator: StringIterator<'a>,
    inj_index: usize,
}

pub struct HtmlWriter<'a> {
    html_result: String,
    builds: HashMap<String, Results<'a>>,
    tab_count: usize,
    index_count: usize,
    stack: Vec<StackBit<'a>>,
}

impl HtmlWriter<'_> {
    pub fn build(template: &'_ Template) {
        // get template iterator
        let mut stack = Vec::<StackBit>::new();

        stack.push(StackBit {
            iterator: StringIterator::new(&template.template),
            template: template,
            inj_index: 0,
        });

        let mut result = String::from("");
        let mut tab_count = 0;

        while stack.len() != 0 {
            let mut stack_bit = match stack.pop() {
                Some(n) => n,
                _ => return,
            };

            while let Some(node_step) = stack_bit.iterator.next() {
                match node_step.kind {
                    TAGNAME => {
                        result.push_str(&"\t".repeat(tab_count));
                        result.push_str("<");
                        result.push_str(get_chunk(&stack_bit.template, &node_step.vector));
                    }
                    NODE_CLOSED => {
                        result.push_str(">\n");
                        tab_count += 1;
                    }
                    ATTRIBUTE => {
                        result.push_str(" ");
                        result.push_str(get_chunk(&stack_bit.template, &node_step.vector));
                    }
                    ATTRIBUTE_VALUE => {
                        result.push_str("=\"");
                        result.push_str(get_chunk(&stack_bit.template, &node_step.vector));
                        result.push_str("\"");
                    }
                    TEXT => {
                        let text_iterator =
                            get_chunk(&stack_bit.template, &node_step.vector).split("\n");
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
                        result.push_str(get_chunk(&stack_bit.template, &node_step.vector));
                        result.push_str(">\n");
                    }
                    INJECTION_FOUND => {
                        let injection = &stack_bit.template.injections[stack_bit.inj_index];

                        // need to match injection enum with injection type
                        match injection {
                            Injection::Str(inj_str) => {
                                let text_iterator = inj_str.split("\n");
                                for text in text_iterator {
                                    result.push_str(&"\t".repeat(tab_count));
                                    result.push_str(text.trim());
                                    result.push_str("\n");
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
        }

        // add to html result by step

        // while loop. while

        // if attribute injection, get text

        // if attribute map, add each attribute, if multiple on multiple lines

        // if injection, add current back to stack
        //  add new stack bit to stack.

        println!("{}", result)
    }
}

fn get_chunk<'a>(template: &Template<'a>, vector: &Vector) -> &'a str {
    &template.template[vector.origin..vector.target]
}

// standalone
pub fn html<'a>(template: &'a str, injections: Vec<Injection<'a>>) -> Template<'a> {
    Template {
        template: template,
        injections: injections,
    }
}

/*

fn document_component = (ctx, args) => {
    ctx.html("<i>", []);
}

*/
