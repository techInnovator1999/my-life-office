export type InfinityPaginationResultType<T> = Readonly<{
  data: T[];
  current: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}>;
