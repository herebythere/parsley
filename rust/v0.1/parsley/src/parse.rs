use crate::text_vector;

/*
	better for enum or better for builder?
	
	builder()
		.add_node_step()
		.add_injection_step()
*/

pub struct NodeStep {
	kind: &str,
	vector: text_vector::Vector,
}

pub struct InjectionStep {
  type: "INJECT";
  kind: &str;
  index: number;
}


// parse string

// parse reader
