#[derive(Debug, Clone)]
pub struct Vector {
	pub origin: usize,
	pub target: usize,	
}

#[derive(Debug, Clone)]
pub struct NodeStep {
	pub kind: String,
	pub vector: Vector,
}

#[derive(Debug, Clone)]
pub struct InjectionStep {
  pub kind: String,
  pub index: usize,
}

