/*
    Relies on rust matches for lookup tables.

    Fairly shallow tables, might be more performant to
    iterate through ~7 entries but not confirmed

    Also UTF-8 concerns
    https://doc.rust-lang.org/book/ch08-02-strings.html
*/

use crate::constants::{
    ATTRIBUTE, ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_SETTER,
    ATTRIBUTE_VALUE, CLOSE_NODE_CLOSED, CLOSE_NODE_SLASH, CLOSE_NODE_SPACE, CLOSE_TAGNAME, ERROR,
    INDEPENDENT_NODE, INDEPENDENT_NODE_CLOSED, INITIAL, INJECTION, NODE, NODE_CLOSED, NODE_SPACE,
    TAGNAME, TEXT, ATTRIBUTE_MAP_INJECTION, ATTRIBUTE_INJECTION, DESCENDANT_INJECTION
};

use crate::constants::{INJECTION_CONFIRMED, INJECTION_FOUND, INJECTION_SPACE};

const LB: &char = &'<';
const RB: &char = &'>';
const SP: &char = &' ';
const NL: &char = &'\n';
const TB: &char = &'\t';
const FS: &char = &'/';
const QT: &char = &'\'';
const EQ: &char = &'=';

// rust enums might be easier but more obscured

pub fn route<'a>(chr: &char, prev_state: &'a str) -> &'a str {
    match prev_state {
        // prevoius state
        // INITIAL => get_state_from_initial(chr),
        // TEXT => get_state_from_initial(chr),
        NODE => get_state_from_node(chr),
        CLOSE_NODE_SLASH => get_state_from_close_node_slash(chr),
        TAGNAME => get_state_from_tagname(chr),
        CLOSE_TAGNAME => get_state_from_close_tagname(chr),
        CLOSE_NODE_SPACE => get_state_from_close_node_space(chr),
        INDEPENDENT_NODE => get_state_from_independent_node(chr),
        // NODE_CLOSED => get_state_from_initial(chr),
        // CLOSE_NODE_CLOSED => get_state_from_initial(chr),
        // INDEPENDENT_NODE_CLOSED => get_state_from_initial(chr),
        NODE_SPACE => get_state_from_node_space(chr),
        ATTRIBUTE => get_state_from_attribute(chr),
        ATTRIBUTE_SETTER => get_state_from_attribute_setter(chr),
        ATTRIBUTE_DECLARATION => get_state_from_attribute_declaration(chr),
        ATTRIBUTE_VALUE => get_state_from_attribute_value(chr),
        ATTRIBUTE_DECLARATION_CLOSE => get_state_from_attribute_declaration_close(chr),
        // 
        ATTRIBUTE_MAP_INJECTION => get_state_from_injection_found(chr),
        // ATTRIBUTE_INJECTION => get_state_from_injection_found(chr),
        DESCENDANT_INJECTION => get_state_from_injection_found(chr),
        //INJECTION_FOUND => get_state_from_injection_found(chr),
        INJECTION_SPACE => get_state_from_injection_space(chr),
        // INJECTION_CONFIRMED => get_state_from_injection_CONFIRMED(chr),
        _ => get_state_from_initial(chr),
    }
}

// need to add injection logic here
// and can create an error node

fn get_state_from_initial<'a>(chr: &char) -> &'a str {
    match chr {
        '<' => NODE,
        '{' => DESCENDANT_INJECTION,  // DESCENDANT_INJECTION
        _ => TEXT,
    }
}

fn get_state_from_node<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return ERROR;
    }

    match chr {
        '/' => CLOSE_NODE_SLASH,
        '>' => ERROR,
        _ => TAGNAME,
    }
}

fn get_state_from_tagname<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return NODE_SPACE;
    }

    match chr {
        '>' => NODE_CLOSED,
        '/' => INDEPENDENT_NODE,
        _ => TAGNAME,
    }
}

fn get_state_from_close_node_slash<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return ERROR;
    }

    CLOSE_TAGNAME
}

fn get_state_from_close_tagname<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return CLOSE_NODE_SPACE;
    }

    match chr {
        '>' => CLOSE_NODE_CLOSED,
        _ => CLOSE_TAGNAME,
    }
}

fn get_state_from_close_node_space<'a>(chr: &char) -> &'a str {
    match chr {
        '>' => CLOSE_NODE_CLOSED,
        _ => CLOSE_NODE_SPACE,
    }
}

pub fn get_state_from_independent_node<'a>(chr: &char) -> &'a str {
    match chr {
        '>' => INDEPENDENT_NODE_CLOSED,
        _ => INDEPENDENT_NODE,
    }
}

fn get_state_from_node_space<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return NODE_SPACE;
    }

    match chr {
        '>' => NODE_CLOSED,
        '/' => INDEPENDENT_NODE,
        '{' => ATTRIBUTE_MAP_INJECTION,
        _ => ATTRIBUTE,
    }
}

fn get_state_from_attribute<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return NODE_SPACE;
    }

    match chr {
        '=' => ATTRIBUTE_SETTER,
        '>' => NODE_CLOSED,
        '/' => INDEPENDENT_NODE,
        '{' => INJECTION_FOUND,
        _ => ATTRIBUTE,
    }
}

fn get_state_from_attribute_setter<'a>(chr: &char) -> &'a str {
    match chr {
        '"' => ATTRIBUTE_DECLARATION,
        _ => ATTRIBUTE_VALUE,
    }
}

fn get_state_from_attribute_declaration<'a>(chr: &char) -> &'a str {
    match chr {
        '"' => ATTRIBUTE_DECLARATION_CLOSE,
        _ => ATTRIBUTE_VALUE,
    }
}

fn get_state_from_attribute_value<'a>(chr: &char) -> &'a str {
    match chr {
        '"' => ATTRIBUTE_DECLARATION_CLOSE,
        '{' => INJECTION_FOUND,
        _ => ATTRIBUTE_VALUE,
    }
}

fn get_state_from_attribute_declaration_close<'a>(chr: &char) -> &'a str {
    match chr {
        '>' => NODE_CLOSED,
        '/' => INDEPENDENT_NODE,
        _ => NODE_SPACE,
    }
}

fn get_state_from_injection_found<'a>(chr: &char) -> &'a str {
    match chr {
        '}' => INJECTION_CONFIRMED,
        _ => INJECTION_SPACE,
    }
}

fn get_state_from_injection_space<'a>(chr: &char) -> &'a str {
    match chr {
        '}' => INJECTION_CONFIRMED,
        _ => INJECTION_SPACE,
    }
}
