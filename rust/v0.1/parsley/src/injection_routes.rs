use crate::constants::{INITIAL, INJECTION_CONFIRMED, INJECTION_FOUND, SPACE};

pub fn route<'a>(chr: &char, prev_state: &'a str) -> &'a str {
    match prev_state {
        INJECTION_FOUND => get_state_from_injection_found(chr),
        _ => get_state_from_space(chr),
    }
}

fn get_state_from_space<'a>(chr: &char) -> &'a str {
    match chr {
        '{' => INJECTION_FOUND,
        _ => SPACE,
    }
}

fn get_state_from_injection_found<'a>(chr: &char) -> &'a str {
    match chr {
        '}' => INJECTION_CONFIRMED,
        _ => SPACE,
    }
}
