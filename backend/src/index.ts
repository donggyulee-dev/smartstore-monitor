// src/index.ts
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// TODO: routes 연결

app.listen(PORT, () => {
    console.log(`[server] Server is running on port ${PORT}`);
});
