export interface SalesTrendItem {
    date: string; // e.g., "2025-03-28"
    hour: number; // 0 ~ 23
    orderCount: number; // 주문 수
    revenue: number; // 매출 금액 (₩)
}

export interface SalesTrendData {
    hour: string; // e.g. '00시'
    orderCount: number;
    revenue: number;
}
