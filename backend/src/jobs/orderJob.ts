// src/jobs/orderJob.ts
import { fetchRecentOrders } from "../services/orderService";
import { CONFIG } from "../config";
import { sendSlackMessage } from "../utils/slack";
import { SmartstoreOrderResponse } from "../types/order.types";
import { NotifiedCache } from "../utils/notifiedCache";

// 환경 변수에서 설정한 주문 폴링 주기 사용
const ORDER_POLLING_INTERVAL = CONFIG.ORDER_POLLING_INTERVAL;

// 폴링 작업 상태 관리
let orderPollingIntervalId: NodeJS.Timeout | null = null;
let isPollingRunning = false;

// 처리된 주문 ID 관리
const orderCache = new NotifiedCache("processed_orders.csv");

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatOrderSlackMessage(order: SmartstoreOrderResponse): string {
    return [
        "🛎️ [주문 알림] 신규 주문이 접수되었습니다!",
        "",
        `🗓️ 주문일자: ${formatDate(order.orderDate)}`,
        `📦 상품명: ${order.productName}`,
        `🧩 옵션: ${order.option ?? "없음"}`,
        `👤 주문자: ${order.ordererName}`,
        `📞 연락처: ${order.ordererTel}`,
        `🧾 주문번호: ${order.productOrderId}`,
    ].join("\n");
}

export function startOrderPollingJob() {
    if (isPollingRunning) {
        console.log("[job] 주문 폴링 작업이 이미 실행 중입니다.");
        return;
    }

    console.log(`[job] 주문 폴링 작업 시작 (주기: ${ORDER_POLLING_INTERVAL}ms)`);
    isPollingRunning = true;

    // 즉시 첫 실행
    checkNewOrders();

    // 주기적 실행 시작
    orderPollingIntervalId = setInterval(checkNewOrders, ORDER_POLLING_INTERVAL);
}

export function stopOrderPollingJob() {
    if (!isPollingRunning || !orderPollingIntervalId) {
        console.log("[job] 실행 중인 주문 폴링 작업이 없습니다.");
        return;
    }

    clearInterval(orderPollingIntervalId);
    isPollingRunning = false;
    console.log("[job] 주문 폴링 작업이 중지되었습니다.");
}

async function checkNewOrders() {
    try {
        console.log("[job] 새로운 주문 확인 중...");
        const orders = await fetchRecentOrders();

        // 새로운 주문 필터링 (중복 제외)
        const newOrders = orders.filter((order) => !orderCache.has(order.productOrderId));

        if (newOrders.length > 0) {
            console.log(`[job] 새로운 주문 발견: ${newOrders.length}건`);

            // 신규 주문 정보 로그 출력
            newOrders.forEach((order, idx) => {
                console.log(`[job] [${idx + 1}] ${order.productOrderId} | ${order.ordererName} | ${order.productName}`);
            });

            // 처리된 주문 ID 추가
            orderCache.addMany(newOrders.map((order) => order.productOrderId));

            // 신규 주문 정보를 Slack에 전송
            for (const order of newOrders) {
                await sendSlackMessage(formatOrderSlackMessage(order));
            }
        }
    } catch (error) {
        console.error("[job] 주문 확인 실패:", error);
    }
}

// 프로세스 종료 시 정리
process.on("SIGTERM", stopOrderPollingJob);
process.on("SIGINT", stopOrderPollingJob);
