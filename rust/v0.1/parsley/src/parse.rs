use std::collections::LinkedList;
use std::str::CharIndices;

use crate::constants::{
    ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_INJECTION,
    ATTRIBUTE_MAP_INJECTION, ATTRIBUTE_VALUE, CLOSE_NODE_CLOSED, DESCENDANT_INJECTION,
    INDEPENDENT_NODE_CLOSED, INITIAL, INJECTION, INJECTION_CONFIRMED, INJECTION_FOUND, NODE_CLOSED,
    NODE_SPACE, TAGNAME, TEXT,
};
use crate::routes;
use crate::type_flyweight::{NodeStep, Vector};

// cache build steps

pub fn get_injection_type(build_step: &str) -> Option<&str> {
    match build_step {
        ATTRIBUTE_DECLARATION => Some(ATTRIBUTE_INJECTION),
        ATTRIBUTE_VALUE => Some(ATTRIBUTE_INJECTION),
        // attribute maps
        NODE_SPACE => Some(ATTRIBUTE_MAP_INJECTION),
        ATTRIBUTE_DECLARATION_CLOSE => Some(ATTRIBUTE_MAP_INJECTION),
        TAGNAME => Some(ATTRIBUTE_MAP_INJECTION),
        // descendants
        CLOSE_NODE_CLOSED => Some(DESCENDANT_INJECTION),
        INDEPENDENT_NODE_CLOSED => Some(DESCENDANT_INJECTION),
        INITIAL => Some(DESCENDANT_INJECTION),
        NODE_CLOSED => Some(DESCENDANT_INJECTION),
        TEXT => Some(DESCENDANT_INJECTION),
        // default
        _ => None,
    }
}

pub struct StringIterator<'a> {
    queue: LinkedList<NodeStep<'a>>,
    template: &'a str,
    template_indices: CharIndices<'a>,
    prev_inj_kind: &'a str,
}

impl StringIterator<'_> {
    pub fn new(template: &'_ str) -> StringIterator {
        StringIterator {
            template: template,
            template_indices: template.char_indices(),
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

    pub fn next(&mut self) -> Option<NodeStep> {
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

            let curr_kind = match front.kind == INJECTION_CONFIRMED {
                true => routes::route(&glyph, &self.prev_inj_kind),
                _ => routes::route(&glyph, &front.kind),
            };

            if curr_kind == INJECTION_FOUND {
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
