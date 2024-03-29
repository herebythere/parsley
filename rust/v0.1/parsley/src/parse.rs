use std::collections::{HashMap, LinkedList};
use std::str::CharIndices;

use crate::constants::{
    ATTRIBUTE_INJECTION, ATTRIBUTE_MAP_INJECTION, DESCENDANT_INJECTION, INITIAL,
    INJECTION_CONFIRMED,
};
use crate::routes;
use crate::type_flyweight::{NodeStep, Vector};

pub fn parse_str<'a>(template_str: &'a str) -> Vec<NodeStep<'a>> {
    let mut steps = Vec::from([NodeStep {
        kind: INITIAL,
        vector: Vector {
            origin: 0,
            target: 0,
        },
    }]);

    let mut prev_inj_kind = INITIAL;
    let mut indices = template_str.char_indices();

    while let Some((index, glyph)) = indices.next() {
        let mut front_step = match steps.pop() {
            Some(step) => step,
            None => return steps,
        };

        let prev_kind = match front_step.kind == INJECTION_CONFIRMED {
            true => &prev_inj_kind,
            _ => &front_step.kind,
        };

        let curr_kind = routes::route(&glyph, prev_kind);
        let has_changed = curr_kind != front_step.kind;
        if is_injection_kind(curr_kind) {
            prev_inj_kind = front_step.kind;
        }

        front_step.vector.target = index.clone();
        steps.push(front_step);

        if has_changed {
            steps.push(NodeStep {
                kind: curr_kind,
                vector: Vector {
                    origin: index.clone(),
                    target: index.clone(),
                },
            });
        }
    }

    match steps.pop() {
        Some(mut step) => {
            step.vector.target = template_str.len();
            steps.push(step);
            steps
        }
        None => steps,
    }
}

pub fn get_chunk<'a>(template_str: &'a str, vector: &Vector) -> &'a str {
    &template_str[vector.origin..vector.target]
}

/* Below is drafting for other implementations */

// this would be beneficial for parsing large files
// not in scope, redesigned above
struct StringIterator<'a> {
    queue: LinkedList<NodeStep<'a>>,
    template: &'a str,
    template_indices: CharIndices<'a>,
    prev_inj_kind: &'a str,
}

impl StringIterator<'_> {
    pub fn next(&mut self) -> Option<NodeStep> {
        if self.queue.len() == 1 {
            self.get_next_step();
        };

        self.queue.pop_back()
    }

    fn get_next_step(&mut self) {
        while let Some((index, glyph)) = &self.template_indices.next() {
            let front = match self.queue.front() {
                Some(f) => f,
                None => return,
            };

            let prev_kind = match front.kind == INJECTION_CONFIRMED {
                true => &self.prev_inj_kind,
                _ => &front.kind,
            };

            let curr_kind = routes::route(&glyph, prev_kind);

            if is_injection_kind(curr_kind) {
                self.prev_inj_kind = front.kind;
            }

            if curr_kind != front.kind {
                self.update_front(&index);
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

        // for tail end of the string, akin to EOF
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
        _ => false,
    }
}

fn iter<'a>(template_str: &'a str) -> StringIterator<'a> {
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
