/*
	Relies on rust matches for lookup tables.
	
	Fairly shallow tables, might be more performant to
	iterate through ~7 entries but not confirmed
	
	Also UTF-8 concerns
	https://doc.rust-lang.org/book/ch08-02-strings.html
*/

use crate::constants::{
  ATTRIBUTE,
  ATTRIBUTE_DECLARATION,
  ATTRIBUTE_DECLARATION_CLOSE,
  ATTRIBUTE_SETTER,
  ATTRIBUTE_VALUE,
  CLOSE_NODE_CLOSED,
  CLOSE_NODE_SLASH,
  CLOSE_NODE_SPACE,
  CLOSE_TAGNAME,
  ERROR,
  INDEPENDENT_NODE,
  INDEPENDENT_NODE_CLOSED,
  INITIAL,
  NODE,
  NODE_CLOSED,
  NODE_SPACE,
  TAGNAME,
  TEXT,
};

const LB: &str = "<";
const RB: &str = ">";
const SP: &str = " ";
const NL: &str = "\n";
const TB: &str = "\t";
const FS: &str = "/";
const QT: &str = "\"";
const EQ: &str = "=";

pub fn route<'a>(chr: &'a str, prev_state: &'a str) -> &'a str {
	match prev_state {
		// prevoius state
		INITIAL => get_state_from_initial(chr),
		TEXT => get_state_from_initial(chr),
		NODE => get_state_from_node(chr),
		CLOSE_NODE_SLASH => get_state_from_close_node_slash(chr),
		TAGNAME => get_state_from_tagname(chr),
  	CLOSE_TAGNAME => get_state_from_close_tagname(chr),
		CLOSE_NODE_SPACE => get_state_from_close_node_space(chr),
		INDEPENDENT_NODE => get_state_from_independent_node(chr),
		NODE_CLOSED => get_state_from_initial(chr),
		CLOSE_NODE_CLOSED => get_state_from_initial(chr),
		INDEPENDENT_NODE_CLOSED => get_state_from_initial(chr),
		NODE_SPACE => get_state_from_node_space(chr),
		ATTRIBUTE => get_state_from_attribute(chr),
		ATTRIBUTE_SETTER => get_state_from_attribute_setter(chr),
		ATTRIBUTE_DECLARATION => get_state_from_attribute_declaration(chr),
		ATTRIBUTE_VALUE => get_state_from_attribute_value(chr),
		ATTRIBUTE_DECLARATION_CLOSE => get_state_from_attribute_declaration_close(chr),
		_ => TEXT
	}
}

fn get_state_from_initial<'a>(chr: &'a str) -> &'a str {
	match chr {
		"<" => NODE,
		_ => TEXT,
	}
}

fn get_state_from_node<'a>(chr: &'a str) -> &'a str {
	match chr {
		" " => ERROR,
		"\n" => ERROR,
		"\t" => ERROR,
		"/" => CLOSE_NODE_SLASH,
		">" => ERROR,
		_ => TAGNAME,
	}
}

fn get_state_from_close_node_slash<'a>(chr: &'a str) -> &'a str {
	match chr {
		" " => ERROR,
		"\n" => ERROR,
		"\t" => ERROR,
		_ => CLOSE_TAGNAME,
	}
}

fn get_state_from_tagname<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => NODE_CLOSED,
		" " => NODE_SPACE,
		"\n" => NODE_SPACE,
		"\t" => NODE_SPACE,
		"/" => INDEPENDENT_NODE,
		_ => TAGNAME,
	}
}

fn get_state_from_close_tagname<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => CLOSE_NODE_CLOSED,
		" " => CLOSE_NODE_SPACE,
		"\n" => CLOSE_NODE_SPACE,
		"\t" => CLOSE_NODE_SPACE,
		_ => CLOSE_TAGNAME,
	}
}

fn get_state_from_close_node_space<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => CLOSE_NODE_CLOSED,
		_ => CLOSE_NODE_SPACE,
	}
}

pub fn get_state_from_independent_node<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => INDEPENDENT_NODE_CLOSED,
		_ => INDEPENDENT_NODE,
	}
}

fn get_state_from_node_space<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => NODE_CLOSED,
		" " => NODE_SPACE,
		"\n" => NODE_SPACE,
		"\t" => NODE_SPACE,
		"/" => INDEPENDENT_NODE,
		_ => ATTRIBUTE,
	}
}

fn get_state_from_attribute<'a>(chr: &'a str) -> &'a str {
	match chr {
		" " => NODE_SPACE,
		"\n" => NODE_SPACE,
		"\t" => NODE_SPACE,
		"=" => ATTRIBUTE_SETTER,
		">" => NODE_CLOSED, 
		"/" => INDEPENDENT_NODE,
		_ => ATTRIBUTE,
	}
}

fn get_state_from_attribute_setter<'a>(chr: &'a str) -> &'a str {
	match chr {
		"\"" => ATTRIBUTE_DECLARATION_CLOSE,
		_ => ATTRIBUTE_VALUE,
	}
}

fn get_state_from_attribute_declaration<'a>(chr: &'a str) -> &'a str {
	match chr {
		"\"" => ATTRIBUTE_DECLARATION_CLOSE,
		_ => ATTRIBUTE_VALUE,
	}
}

fn get_state_from_attribute_value<'a>(chr: &'a str) -> &'a str {
	match chr {
		"\"" => ATTRIBUTE_DECLARATION_CLOSE,
		_ => ATTRIBUTE_VALUE,
	}
}

fn get_state_from_attribute_declaration_close<'a>(chr: &'a str) -> &'a str {
	match chr {
		">" => NODE_CLOSED,
		"/" => INDEPENDENT_NODE,
		_ => NODE_SPACE,
	}
}
