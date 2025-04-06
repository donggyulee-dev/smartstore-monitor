// src/index.ts
import dotenv from "dotenv";
// 가장 먼저 환경 변수 로드
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/order";

// 환경 변수 체크
const requiredEnvVars = ["CLIENT_ID", "CLIENT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error("[server] 필수 환경 변수가 누락되었습니다:", missingEnvVars);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ 반드시 먼저 호출!
app.use(cors());

// ✅ 그리고 나서 JSON 처리
app.use(express.json());

// 테스트용 핑 API
app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: "pong!" });
});

// 라우터 연결
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
    console.log(`[server] Server is running on port ${PORT}`);
});
