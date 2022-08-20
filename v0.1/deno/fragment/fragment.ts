interface Fragment<N, A, P> {
    connect(): void;
    update(params: P): void;
    disconnect(): void;
}

