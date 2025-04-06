// src/index.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/order";
import { startOrderPollingJob } from "./jobs/orderJob";

// 1. 환경 변수 설정
dotenv.config();

// 2. 환경 변수 검증
const requiredEnvVars = ["CLIENT_ID", "CLIENT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error("[server] 필수 환경 변수가 누락되었습니다:", missingEnvVars);
    process.exit(1);
}

// 3. Express 앱 설정
const app = express();
const PORT = process.env.PORT || 5050;

// 4. 미들웨어 설정
app.use(cors());
app.use(express.json());

// 5. 헬스체크 API
app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: "pong!" });
});

// 6. 라우터 설정
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// 7. 주문 폴링 작업 시작
startOrderPollingJob();

// 8. 서버 시작
app.listen(PORT, () => {
    console.log(`[server] Server is running on port ${PORT}`);
});