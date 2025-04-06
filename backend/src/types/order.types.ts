export interface SmartstoreOrder {
    productOrderId: string;
    productName: string;
    orderDate: string;
    ordererName: string;
    ordererTel: string;
}

export interface SmartstoreOrderResponse {
    productOrderId: string; // 주문 번호
    productName: string; // 상품명
    orderDate: string; // 주문일시 (ISO 문자열)
    ordererName: string; // 주문자 이름
    ordererTel: string; // 전화번호
    option?: string; // 옵션명 (선택값)
}