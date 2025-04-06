// src/jobs/orderJob.ts
import { fetchRecentOrders } from "../services/orderService";
import { CONFIG } from "../config";

// 환경 변수에서 설정한 주문 폴링 주기 사용
const ORDER_POLLING_INTERVAL = CONFIG.ORDER_POLLING_INTERVAL;

// 폴링 작업 상태 관리
let orderPollingIntervalId: NodeJS.Timeout | null = null;
let isPollingRunning = false;

// 중복 처리 방지를 위한 임시 캐시
const notifiedOrderIds = new Set<string>();

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
        const newOrders = orders.filter((order) => !notifiedOrderIds.has(order.productOrderId));

        if (newOrders.length > 0) {
            console.log(`[job] 새로운 주문 발견: ${newOrders.length}건`);

            // 신규 주문 정보 로그 출력
            newOrders.forEach((order, idx) => {
                console.log(`[job] [${idx + 1}] ${order.productOrderId} | ${order.ordererName} | ${order.productName}`);
            });

            // 처리된 주문 ID 캐시에 추가
            newOrders.forEach((order) => {
                notifiedOrderIds.add(order.productOrderId);
            });

            // TODO: 향후 Slack 연동 처리
        }

        // 캐시 크기 관리 (최근 1000개만 유지)
        if (notifiedOrderIds.size > 1000) {
            const idsArray = Array.from(notifiedOrderIds);
            const newIds = new Set(idsArray.slice(-1000));
            notifiedOrderIds.clear();
            idsArray.slice(-1000).forEach((id) => notifiedOrderIds.add(id));
        }
    } catch (error) {
        console.error("[job] 주문 확인 실패:", error);
    }
}

// 프로세스 종료 시 정리
process.on("SIGTERM", stopOrderPollingJob);
process.on("SIGINT", stopOrderPollingJob);
