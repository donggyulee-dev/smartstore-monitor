import express, { Request, Response } from "express";
import { fetchRecentOrders } from "../services/orderService";
import { SuccessResponse, ErrorResponse } from "../types/response.types";

const router = express.Router();

// 최근 주문 목록 조회
router.get("/recent", async (req: Request, res: Response<SuccessResponse<any> | ErrorResponse>) => {
    try {
        const orders = await fetchRecentOrders();
        res.json({
            success: true,
            data: orders,
            message: "주문 목록 조회 성공",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: "주문 목록 조회 실패",
            code: error.response?.status?.toString(),
        });
    }
});

export default router;
