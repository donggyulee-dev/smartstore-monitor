import { SalesTrendItem } from "@/types/sales";
import { getToday, getYesterday } from "@/utils/date";

// 날짜별 시간대 판매 데이터 (시간 단위 기준: 0 ~ 23시)
export const SALES_TREND_DATA: SalesTrendItem[] = [
    { date: getToday(), hour: 0, orderCount: 1, revenue: 3000 },
    { date: getToday(), hour: 1, orderCount: 0, revenue: 0 },
    { date: getToday(), hour: 2, orderCount: 0, revenue: 0 },
    { date: getToday(), hour: 3, orderCount: 2, revenue: 5000 },
    { date: getToday(), hour: 4, orderCount: 4, revenue: 12000 },
    { date: getToday(), hour: 5, orderCount: 6, revenue: 18000 },
    { date: getToday(), hour: 6, orderCount: 10, revenue: 32000 },
    { date: getToday(), hour: 7, orderCount: 12, revenue: 38000 },
    { date: getToday(), hour: 8, orderCount: 8, revenue: 24000 },
    { date: getToday(), hour: 9, orderCount: 16, revenue: 46000 },
    { date: getToday(), hour: 10, orderCount: 20, revenue: 60000 },
    { date: getToday(), hour: 11, orderCount: 18, revenue: 56000 },
    { date: getToday(), hour: 12, orderCount: 14, revenue: 43000 },
    { date: getToday(), hour: 13, orderCount: 22, revenue: 68000 },
    { date: getToday(), hour: 14, orderCount: 30, revenue: 94000 },
    { date: getToday(), hour: 15, orderCount: 26, revenue: 85000 },
    { date: getToday(), hour: 16, orderCount: 18, revenue: 56000 },
    { date: getToday(), hour: 17, orderCount: 15, revenue: 46000 },
    { date: getToday(), hour: 18, orderCount: 10, revenue: 31000 },
    { date: getToday(), hour: 19, orderCount: 6, revenue: 19000 },
    { date: getToday(), hour: 20, orderCount: 4, revenue: 11000 },
    { date: getToday(), hour: 21, orderCount: 2, revenue: 7000 },
    { date: getToday(), hour: 22, orderCount: 1, revenue: 3000 },
    { date: getToday(), hour: 23, orderCount: 0, revenue: 0 },

    // 어제 데이터
    { date: getYesterday(), hour: 10, orderCount: 12, revenue: 32000 },
    { date: getYesterday(), hour: 11, orderCount: 14, revenue: 39000 },
    { date: getYesterday(), hour: 12, orderCount: 18, revenue: 51000 },
    { date: getYesterday(), hour: 13, orderCount: 20, revenue: 61000 },
    { date: getYesterday(), hour: 14, orderCount: 24, revenue: 70000 },
    { date: getYesterday(), hour: 15, orderCount: 22, revenue: 64000 },
    { date: getYesterday(), hour: 16, orderCount: 17, revenue: 52000 },
    { date: getYesterday(), hour: 17, orderCount: 10, revenue: 31000 },
    { date: getYesterday(), hour: 18, orderCount: 5, revenue: 15000 },
];
