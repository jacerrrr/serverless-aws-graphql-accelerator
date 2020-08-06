import { UserContext } from '@graphql/context';

/** Abstract service to be inherited by resources services */
export abstract class ResourceService {}

/** GraphQL service for getting a list of resources  */
export interface GetService<T> {
  get(owner?: UserContext): Promise<Array<T>>;
}

/** GraphQL service interface for getting paginated resources  */
export interface GetConnectionFilterService<T> {
  get(ownerId?: string, first?: number, after?: string): Promise<T>;
}

/** GraphQL service interface for finding something by a unique id */
export interface FindService<T> {
  find(uid: string, owner?: UserContext): Promise<T>;
}

/** GraphQL service for creating resources */
export interface CreateService<TI, T> {
  /**
   * Creates a new resource
   * @param input The resource input
   * @param ownerId The ownerId of the resource
   */
  create(input: TI, owner: UserContext): Promise<T>;
}

export interface BulkCreateService<TI, T> {
  /**
   * Creates new resources
   * @param input The resources input
   * @param ownerId The ownerId of the resources
   */
  create(input: Array<TI>, ownerId: string): Promise<Array<T>>;
}

/** GraphQL service for updating resources */
export interface UpdateService<TI, T> {
  /**
   * Updates an existing resource
   * @param id The id of resource to update
   * @param input The resource input
   */
  update(id: string, input: TI, owner: UserContext): Promise<T>;
}

/** GraphQl service for deleting resources  */
export interface RemoveService {
  /**
   * Removes an existing resource
   * @param uid The unique id of the resource
   */
  remove(uid: string, owner: UserContext): Promise<void>;
}

export interface SearchService<Q, T> {
  search(query: Q, owner: UserContext): Promise<Array<T>>;
}
