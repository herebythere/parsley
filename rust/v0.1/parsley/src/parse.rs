use crate::constants::{
    ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_INJECTION,
    ATTRIBUTE_MAP_INJECTION, ATTRIBUTE_VALUE, CLOSE_NODE_CLOSED, DESCENDANT_INJECTION,
    INDEPENDENT_NODE_CLOSED, INITIAL, INJECTION, INJECTION_CONFIRMED, INJECTION_FOUND, NODE_CLOSED,
    NODE_SPACE, TAGNAME, TEXT,
};
use crate::type_flyweight::{Builder, NodeStep, Vector};

use crate::injection_routes;
use crate::routes;

// cache build steps

fn get_injection_type(build_step: &str) -> Option<&str> {
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

// essentially keep track of yet another watch
// routes for {}
// when INJECTION_FOUND (prev_kind != curr_kind && INJECTION_FOUND)
// if INJECTION FOUND
//   add injection_step

// keep previously found kind at injection

pub fn parse_str<T: Builder>(mut builder: T, template: &str) -> T {
    let mut prev_kind = INITIAL;
    let mut curr_kind = INITIAL;
    let mut origin = 0;

    let mut prev_inj_kind = INITIAL;
    let mut curr_inj_kind = INITIAL;
    let mut inj_found_kind = INITIAL;
    let mut inj_origin = 0;

    for (index, glyph) in template.char_indices() {
        prev_kind = curr_kind;
        curr_kind = routes::route(&glyph, prev_kind);

        prev_inj_kind = curr_inj_kind;
        curr_inj_kind = injection_routes::route(&glyph, prev_inj_kind);

        // if injection found
        if prev_inj_kind == INJECTION_CONFIRMED {
            // new start, bring both origins to cursor
            // add node step

            // chunk from here
            if origin < inj_origin {
                builder = builder.add_step(NodeStep {
                    kind: inj_found_kind.to_string(),
                    vector: Vector {
                        origin: origin,
                        target: inj_origin,
                    },
                });
            }

            // add injection step
            let injection_kind = match get_injection_type(inj_found_kind) {
                Some(inj) => inj,
                None => "INJECTION_UNKNOWN_TYPE",
            };

            println!("{} {}", inj_found_kind, injection_kind);
            builder = builder.add_step(NodeStep {
                kind: injection_kind.to_string(),
                vector: Vector {
                    origin: inj_origin,
                    target: index,
                },
            });
            // to here

            origin = inj_origin;
            prev_kind = curr_kind;
        }

        // if delta found
        if prev_kind != curr_kind {
            builder = builder.add_step(NodeStep {
                kind: prev_kind.to_string(),
                vector: Vector {
                    origin: origin,
                    target: index,
                },
            });

            origin = index;
        }

        // possible injection
        if curr_inj_kind == INJECTION_FOUND {
            inj_origin = index;
            inj_found_kind = prev_kind;
        }
    }

    // get last one
    // don't forget injection
    if curr_inj_kind == INJECTION_CONFIRMED {
        // new start, bring both origins to cursor
        // add node step
        if origin < inj_origin {
            builder = builder.add_step(NodeStep {
                kind: prev_kind.to_string(),
                vector: Vector {
                    origin: origin,
                    target: inj_origin,
                },
            });
        }

        let injection_kind = match get_injection_type(curr_kind) {
            Some(inj) => inj,
            None => "INJECTION_UNKNOWN_TYPE",
        };

        // add injection step
        return builder.add_step(NodeStep {
            kind: injection_kind.to_string(),
            vector: Vector {
                origin: inj_origin,
                target: template.len(),
            },
        });
    }

    builder.add_step(NodeStep {
        kind: curr_kind.to_string(),
        vector: Vector {
            origin: origin,
            target: template.len(),
        },
    })
}
