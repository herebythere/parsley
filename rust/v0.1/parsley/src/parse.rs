use std::collections::LinkedList;
use std::str::CharIndices;

use crate::constants::{
    ATTRIBUTE_INJECTION, ATTRIBUTE_MAP_INJECTION, DESCENDANT_INJECTION, INITIAL,
    INJECTION_CONFIRMED,
};
use crate::routes;
use crate::type_flyweight::{NodeStep, Vector};

// can I replace linked list with a curr, prev as an option<NodeStep>
// if curr_node_step is not None, get next step\
// return curr node, set curr node as next step

// handling errors

pub struct StringIterator<'a> {
    queue: LinkedList<NodeStep<'a>>,
    template: &'a str,
    template_indices: CharIndices<'a>,
    prev_inj_kind: &'a str,
}

impl StringIterator<'_> {
    pub fn next(&mut self) -> Option<NodeStep> {
        // get next step
        // if next step, swap current and next
        // current could be none
        // return current
        if self.queue.len() == 1 {
            self.get_next_step();
        }

        self.queue.pop_back()
    }

    fn get_next_step(&mut self) {
        while let Some((index, glyph)) = &self.template_indices.next() {
            self.update_front(&index);

            let front = match self.queue.front() {
                Some(f) => f,
                None => return,
            };

            // if error return

            let prev_kind = match front.kind == INJECTION_CONFIRMED {
                true => &self.prev_inj_kind,
                _ => &front.kind,
            };

            let curr_kind = routes::route(&glyph, prev_kind);

            // set it everytime?
            if is_injection_kind(curr_kind) {
                self.prev_inj_kind = front.kind;
            }

            if curr_kind != front.kind {
                self.queue.push_front(NodeStep {
                    kind: curr_kind,
                    vector: Vector {
                        origin: index.clone(),
                        target: index.clone(),
                    },
                });

                return;
            }
        }

        // for tail end of the string
        // something akin to EOF
        self.update_front(&self.template.len());
    }

    fn update_front(&mut self, number: &usize) {
        let _ = match self.queue.front_mut() {
            Some(f) => f.vector.target = number.clone(),
            None => return,
        };
    }
}

fn is_injection_kind(build_step: &str) -> bool {
    match build_step {
        ATTRIBUTE_INJECTION => true,
        ATTRIBUTE_MAP_INJECTION => true,
        DESCENDANT_INJECTION => true,
        // default
        _ => false,
    }
}

pub fn iter<'a>(template_str: &'a str) -> StringIterator<'a> {
    StringIterator {
        template: template_str,
        template_indices: template_str.char_indices(),
        prev_inj_kind: INITIAL,
        queue: LinkedList::<NodeStep<'_>>::from([NodeStep {
            kind: INITIAL,
            vector: Vector {
                origin: 0,
                target: 0,
            },
        }]),
    }
}

pub fn get_chunk<'a>(template_str: &'a str, vector: &Vector) -> &'a str {
    &template_str[vector.origin..vector.target]
}
