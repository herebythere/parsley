#[derive(Debug, Clone)]
pub struct Vector {
	pub origin: u32,
	pub target: u32,	
}

#[derive(Debug, Clone)]
pub struct NodeStep {
	pub kind: String,
	pub vector: Vector,
}

#[derive(Debug, Clone)]
pub struct InjectionStep {
  pub kind: String,
  pub index: u32,
}

