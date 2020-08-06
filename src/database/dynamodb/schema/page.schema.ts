export interface PageSchema<T, K> {
  items: Array<T>;
  next?: K;
}
