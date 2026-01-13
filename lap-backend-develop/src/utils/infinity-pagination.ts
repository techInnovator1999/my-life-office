import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';

export const infinityPagination = <T>(
  data: T[],
  total: number,
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    current: options.page,
    limit: options.limit,
    total,
    hasNextPage: total > options.limit * options.page,
  };
};
