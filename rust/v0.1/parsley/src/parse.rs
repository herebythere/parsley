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

fn is_injection_kind(build_step: &str) -> bool {
    match build_step {
        ATTRIBUTE_INJECTION => true,
        ATTRIBUTE_MAP_INJECTION => true,
        DESCENDANT_INJECTION => true,
        _ => false,
    }
}

