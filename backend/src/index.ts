// src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();
const PORT = 5050;

// ✅ 반드시 먼저 호출!
app.use(cors());

// ✅ 그리고 나서 JSON 처리
app.use(express.json());

// 테스트용 핑 API
app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: "pong!" });
});

// 라우터 연결은 마지막에
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`[server] Server is running on port ${PORT}`);
});
