use crate::text_vector;

pub struct NodeStep {
	kind: &str,
	vector: text_vector::Vector,
}

pub struct InjectionStep {
  type: "INJECT";
  kind: string;
  index: number;
}

