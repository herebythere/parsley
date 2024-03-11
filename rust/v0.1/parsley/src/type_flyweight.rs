#[derive(Debug, Clone)]
pub struct Vector {
    pub origin: usize,
    pub target: usize,
}

#[derive(Debug, Clone)]
pub struct NodeStep<'a> {
    pub kind: &'a str,
    pub vector: Vector,
}

pub type Results<'a> = Vec<NodeStep<'a>>;
