use crate::constants::{
    ATTRIBUTE, ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_MAP_INJECTION,
    ATTRIBUTE_SETTER, ATTRIBUTE_VALUE, FRAGMENT_CLOSE, CLOSE_NODE_CLOSED, CLOSE_NODE_SLASH,
    CLOSE_NODE_SPACE, CLOSE_TAGNAME, DESCENDANT_INJECTION, ERROR, FRAGMENT, INDEPENDENT_NODE,
    INDEPENDENT_NODE_CLOSED, INJECTION_CONFIRMED, INJECTION_SPACE, NODE, NODE_CLOSED, NODE_SPACE,
    TAGNAME, TEXT,
};

pub fn route<'a>(chr: &char, prev_state: &'a str) -> &'a str {
    match prev_state {
        NODE => get_state_from_node(chr),
        CLOSE_NODE_SLASH => get_state_from_close_node_slash(chr),
        TAGNAME => get_state_from_tagname(chr),
        CLOSE_TAGNAME => get_state_from_close_tagname(chr),
        CLOSE_NODE_SPACE => get_state_from_close_node_space(chr),
        INDEPENDENT_NODE => get_state_from_independent_node(chr),
        NODE_SPACE => get_state_from_node_space(chr),
        ATTRIBUTE => get_state_from_attribute(chr),
        ATTRIBUTE_SETTER => get_state_from_attribute_setter(chr),
        ATTRIBUTE_DECLARATION => get_state_from_attribute_declaration(chr),
        ATTRIBUTE_VALUE => get_state_from_attribute_value(chr),
        ATTRIBUTE_DECLARATION_CLOSE => get_state_from_attribute_declaration_close(chr),
        ATTRIBUTE_MAP_INJECTION => get_state_from_injection_found(chr),
        DESCENDANT_INJECTION => get_state_from_injection_found(chr),
        INJECTION_SPACE => get_state_from_injection_space(chr),
        ERROR => get_state_from_error(chr),
        _ => get_state_from_initial(chr),
    }
}

fn get_state_from_initial<'a>(chr: &char) -> &'a str {
    match chr {
        '<' => NODE,
        '{' => DESCENDANT_INJECTION,
        _ => TEXT,
    }
}

fn get_state_from_node<'a>(chr: &char) -> &'a str {
    if chr.is_whitespace() {
        return NODE;
    }

    match chr {
        '/' => CLOSE_NODE_SLASH,
        '>' => FRAGMENT,
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
        return CLOSE_NODE_SLASH;
    }

    match chr {
        '>' => FRAGMENT_CLOSE,
        _ => CLOSE_TAGNAME,
    }
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
        '{' => ATTRIBUTE_MAP_INJECTION,
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

fn get_state_from_error<'a>(_chr: &char) -> &'a str {
    ERROR
}
