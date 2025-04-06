// 네이버 API 응답 타입
export interface NaverTokenAPIResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

// 내부에서 사용할 토큰 페이로드 타입
export interface NaverTokenPayload {
    token: string;
    expiresAt: number;
}
