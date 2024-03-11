// start with string, load file next

// go over with iterator

// output to file

// keep track of tabs
// remove whitespace cruft
// outputing

// "<hello>{}</hello>", world

//
use parsley::constants::{
    ATTRIBUTE, ATTRIBUTE_VALUE, CLOSE_TAGNAME, INJECTION_FOUND, NODE_CLOSED, TAGNAME, TEXT, INDEPENDENT_NODE_CLOSED
};
use parsley::parse::{get_injection_type, StringIterator};
use parsley::type_flyweight::{Results, Vector};
use std::collections::HashMap;

#[derive(Debug)]
pub enum Injection<'a> {
    Text(&'a str),
    Attrs(Vec<String>),
    AttrMap(Vec<(String, String)>),
    Template(Template<'a>),
    Templates(Vec<Template<'a>>),
}

#[derive(Debug)]
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
                    INDEPENDENT_NODE_CLOSED => {
                        result.push_str("/>\n");
                    		tab_count -=1;
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
                        stack_bit.inj_index += 1;
                        
                        // could just be an array of injections, same type
                        // [text, template, template, text]
                        // [(attribute, value)

												// for each injection
                        // need to match injection enum with injection type
                        
                        match injection {
                            Injection::Text(inj_str) => {
                                let text_iterator = inj_str.split("\n");
                                for text in text_iterator {
                                    result.push_str(&"\t".repeat(tab_count));
                                    result.push_str(text.trim());
                                    result.push_str("\n");
                                }
                            }
                            Injection::Attrs(attrs) => {
                              for attr in attrs {
                                  result.push_str(" ");
                                  result.push_str(attr);
                              }
                            }
                            Injection::AttrMap(attr_map) => {
                              for (attr, value) in attr_map {
                                  result.push_str(" ");
                                  result.push_str(attr);
                                  result.push_str("=\"");
                                  result.push_str(value);
                                  result.push_str("\"");
                              }
                            }
                            Injection::Template(template) => {
                                let next_stack_bit = StackBit {
                                    iterator: StringIterator::new(&template.template),
                                    template: template,
                                    inj_index: 0,
                                };

                                stack.push(stack_bit);
                                stack.push(next_stack_bit);
                                break;
                            }
                            Injection::Templates(templates) => {
                              stack.push(stack_bit);
                              
                              let mut index = templates.len() - 1;
                              while index > -1 {
                              	let template = templates[index];
                              	
                              	index -= 1;
                              }
                            	for template in templates {
                                let next_stack_bit = StackBit {
                                    iterator: StringIterator::new(&template.template),
                                    template: template,
                                    inj_index: 0,
                                };


                                stack.push(next_stack_bit);
                            	}
  	                          break;                            	
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
        }

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
