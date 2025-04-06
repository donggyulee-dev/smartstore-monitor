// 공통 성공 응답
export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

// 공통 에러 응답
export interface ErrorResponse {
    success: false;
    error: string;
    code?: string;
}

// 네이버 오류 응답 (status 400 등)
// types/response.types.ts
export interface NaverErrorResponse {
    error: string;
    error_description?: string;
    error_code?: string;
    code?: string;
    message?: string;
    timestamp?: string;
    invalidInputs?: {
        name: string;
        type: string;
        message: string;
    }[];
}
