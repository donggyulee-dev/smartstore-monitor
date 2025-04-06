export const CONFIG = {
    ORDER_POLLING_INTERVAL: parseInt(process.env.ORDER_POLLING_INTERVAL ?? "60000", 10), // 기본값 1분
};
