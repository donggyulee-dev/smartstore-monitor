import axios from "axios";
import { getValidToken } from "./naverAuth";
import { SmartstoreOrder } from "../types/order.types";

export async function fetchRecentOrders(): Promise<SmartstoreOrder[]> {
    const tokenPayload = await getValidToken();
    if (!tokenPayload) return [];

    const fromTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const listUrl = "https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/last-changed-statuses";
    const detailUrl = "https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query";

    const headers = {
        Authorization: `Bearer ${tokenPayload.token}`,
        "Content-Type": "application/json",
    };

    try {
        // 1️⃣ 최근 주문 ID 조회
        const listRes = await axios.get(listUrl, {
            headers,
            params: {
                lastChangedFrom: fromTime,
                lastChangedType: "PAYED",
                maxPerPage: 100,
            },
        });

        const productOrderIds = listRes.data.data?.lastChangeStatuses?.map((item: any) => item.productOrderId) || [];

        if (productOrderIds.length === 0) {
            console.log("[order] 최근 주문 없음");
            return [];
        }

        // 2️⃣ 상세 주문 정보 조회
        const detailRes = await axios.post(detailUrl, { productOrderIds }, { headers });

        const orderDetails = detailRes.data.data || [];

        return orderDetails.map((order: any) => {
            const product = order.productOrder || {};
            const info = order.order || {};

            return {
                productOrderId: product.productOrderId,
                productName: product.productName,
                orderDate: info.orderDate,
                ordererName: info.ordererName,
                ordererTel: info.ordererTel,
            };
        });
    } catch (error: any) {
        console.error("[order] 주문 조회 실패:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        return [];
    }
}
