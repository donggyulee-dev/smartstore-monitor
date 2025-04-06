// routes/auth.ts
import express, { Request, Response } from "express";
import { getValidToken } from "../services/naverAuth";
import { SuccessResponse, ErrorResponse } from "../types/response.types";
import { NaverTokenPayload } from "../types/auth.types";

const router = express.Router();

router.get("/naver-token", async (req: Request, res: Response<SuccessResponse<NaverTokenPayload> | ErrorResponse>) => {
    const tokenPayload = await getValidToken();
    if (tokenPayload) {
        res.json({
            success: true,
            data: {
                token: tokenPayload.token.slice(0, 20) + "...",
                expiresAt: tokenPayload.expiresAt,
            },
            message: "토큰 발급 성공",
        });
    } else {
        res.status(500).json({
            success: false,
            error: "토큰 발급 실패",
        });
    }
});

export default router;
