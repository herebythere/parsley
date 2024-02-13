use crate::type_flyweight::{NodeStep, InjectionStep};

pub trait Builder {
    fn add_node_step(self, step: NodeStep) -> Self;
    fn add_injection_step(self, step: InjectionStep) -> Self;
}
