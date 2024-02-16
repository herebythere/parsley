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

pub trait Builder {
  fn add_step(self, step: NodeStep) -> Self;
}
