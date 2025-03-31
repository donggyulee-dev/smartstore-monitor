import { describe, it, expect } from "vitest";

describe("테스트 환경 검증", () => {
    it("테스트 실행이 정상적으로 동작해야 한다", () => {
        expect(true).toBe(true);
    });

    it("기본적인 산술 연산이 정상적으로 동작해야 한다", () => {
        expect(1 + 1).toBe(2);
    });

    it("비동기 테스트가 정상적으로 동작해야 한다", async () => {
        const result = await Promise.resolve(42);
        expect(result).toBe(42);
    });
});
