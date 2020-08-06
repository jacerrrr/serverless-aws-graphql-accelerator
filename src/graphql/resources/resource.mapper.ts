export interface ResourceInputMapper<I, E> {
  toEntity(input: I): E;
}

export interface ResourceModelMapper<M, E> {
  toModel(entity: E): M;
}
