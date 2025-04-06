// src/services/naverAuth.ts
import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { NaverTokenAPIResponse, NaverTokenPayload } from "../types/auth.types";
import { NaverErrorResponse } from "../types/response.types";
import bcrypt from "bcrypt";

const TOKEN_URL = "https://api.commerce.naver.com/external/v1/oauth2/token";

let currentToken: NaverTokenPayload | null = null;
let tokenExpiresAt: number | null = null;

export async function getValidToken(): Promise<NaverTokenPayload | null> {
    const now = Date.now();
    if (currentToken && tokenExpiresAt && now < tokenExpiresAt - 60 * 1000) {
        return currentToken;
    }

    return await refreshToken();
}

async function refreshToken(): Promise<NaverTokenPayload | null> {
    try {
        const clientId = process.env.CLIENT_ID!;
        const clientSecret = process.env.CLIENT_SECRET!;

        console.log("[auth] 토큰 발급 시도:", { clientId });

        const timestamp = Date.now().toString();
        const password = `${clientId}_${timestamp}`;
        const hashed = await bcrypt.hash(password, clientSecret);
        const secretSign = Buffer.from(hashed).toString("base64");

        const data = new URLSearchParams({
            client_id: clientId,
            timestamp,
            grant_type: "client_credentials",
            client_secret_sign: secretSign,
            type: "SELF",
        });

        console.log("[auth] 요청 데이터:", data.toString());

        const response = await axios.post<NaverTokenAPIResponse>(TOKEN_URL, data.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { access_token, expires_in } = response.data;
        const expiresAt = Date.now() + expires_in * 1000;

        currentToken = {
            token: access_token,
            expiresAt,
        };
        tokenExpiresAt = expiresAt;

        console.log("[auth] 토큰 발급 성공:", access_token.slice(0, 20) + "...");
        return currentToken;
    } catch (error) {
        const axiosError = error as AxiosError<NaverErrorResponse>;
        console.error("[auth] 토큰 발급 실패:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
            message: axiosError.message,
        });
        return null;
    }
}
