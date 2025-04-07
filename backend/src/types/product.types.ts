export interface SalesData {
    today: number;
    week: number;
    halfYear: number;
}

export interface Product {
    productId: string;
    name: string;
    salePrice?: number;
    stockQuantity: number;
}

export interface SalesResult extends Product {
    sales: SalesData;
}
