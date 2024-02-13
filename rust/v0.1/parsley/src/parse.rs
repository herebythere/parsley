use crate::constants::{
	ATTRIBUTE_DECLARATION,
	ATTRIBUTE_VALUE,
	NODE_SPACE,
	ATTRIBUTE_DECLARATION_CLOSE,
	TAGNAME,
	CLOSE_NODE_CLOSED,
	INDEPENDENT_NODE_CLOSED,
	NODE_CLOSED,
	INITIAL,
	TEXT,
	ATTRIBUTE_INJECTION,
	ATTRIBUTE_MAP_INJECTION,
	DESCENDANT_INJECTION,
};
use crate::type_flyweight::{
	NodeStep,
	InjectionStep,
	Vector,
};
use crate::builder::Builder;
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
		_ => None
	}
}

pub fn parse_str<T: Builder>(
	mut builder: T,
	template: &str,
) -> T {
	let mut prevKind = INITIAL;
	let mut currKind = INITIAL;
	
	let mut origin = 0;
	let mut target = 0;
	
	for (index, glyph) in template.char_indices() {
		//
		println!("{}{}", &index, &glyph);
		currKind = routes::route(&glyph, prevKind);
		
		if prevKind != currKind {
			builder = builder.add_node_step(NodeStep{
				kind: prevKind.to_string(),
				vector: Vector{origin: origin, target: target},
			});
		}
	}
	
	builder
}

