import { DateRangeEnum } from '../enums/DateRangeEnum';

export function getDateRange(range: DateRangeEnum): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (range) {
    case DateRangeEnum.CURRENT_MONTH:
      startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)); // First day of the current month in UTC
      endDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      ); // Last day of the current month in UTC
      break;
    case DateRangeEnum.LAST_MONTH:
      startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)); // First day of the last month in UTC
      endDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
      ); // Last day of the last month in UTC
      break;
    case DateRangeEnum.LAST_3_MONTHS:
      startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 2, 1)); // First day of 3 months ago in UTC
      endDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      ); // Last day of the current month in UTC
      break;
    case DateRangeEnum.LAST_6_MONTHS:
      startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 5, 1)); // First day of 6 months ago in UTC
      endDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      ); // Last day of the current month in UTC
      break;
    default:
      throw new Error('Invalid date range');
  }

  return { startDate, endDate };
}
