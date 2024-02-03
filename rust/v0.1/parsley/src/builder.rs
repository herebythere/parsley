pub trait Builder<Results> {
    fn add_node_step(&self) -> Self;
    fn add_injection_step(&self) -> Self;
    fn build() -> Results;
}
