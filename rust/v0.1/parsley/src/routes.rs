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
  DEFAULT,
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
		INITIAL => get_state_from_initial(chr, prev_state),
		TEXT => {TEXT},
		CLOSE_NODE_SLASH => {CLOSE_NODE_SLASH},
		TAGNAME => {TAGNAME},
  	CLOSE_TAGNAME => {CLOSE_TAGNAME},
		CLOSE_NODE_SPACE => {CLOSE_NODE_SPACE},
		INDEPENDENT_NODE => {INDEPENDENT_NODE},
		NODE_CLOSED => {NODE_CLOSED},
		CLOSE_NODE_CLOSED => {CLOSE_NODE_CLOSED},
		INDEPENDENT_NODE_CLOSED => {INDEPENDENT_NODE_CLOSED},
		NODE_SPACE => {NODE_SPACE},
		ATTRIBUTE => {ATTRIBUTE},
		ATTRIBUTE_SETTER => {ATTRIBUTE_SETTER},
		ATTRIBUTE_DECLARATION => {ATTRIBUTE_DECLARATION},
		ATTRIBUTE_VALUE => {ATTRIBUTE_VALUE},
		ATTRIBUTE_DECLARATION_CLOSE => {ATTRIBUTE_DECLARATION_CLOSE},
		_ => {TEXT}
	}
}

pub fn get_state_from_initial<'a>(chr: &'a str, prev_state: &'a str) -> &'a str {
	match chr {
		"<" => NODE,
		_ => TEXT,
	}
}
