import { exec } from "child_process";
import { SALES_CONSTANTS } from "../../constants/sales.constants";
import { SalesResult } from "../../types/product.types";

export class SalesCollector {
    productId: string;
    productName: string;
    stockQuantity: number;
    salePrice?: number;
    sales: { today: number; week: number; halfYear: number };

    constructor(productId: string, productName: string, stockQuantity: number) {
        this.productId = productId;
        this.productName = productName;
        this.stockQuantity = stockQuantity;
        this.sales = { today: 0, week: 0, halfYear: 0 };
    }

    async collectSalesData(): Promise<SalesResult> {
        console.log(`\n📦 상품 처리 시작: ${this.productName} (${this.productId})`);

        // 1. 당일 판매량 조회
        const todayResult = await this.fetchSalesData("today", SALES_CONSTANTS.TODAY_BASIS);
        this.sales.today = todayResult.count;

        if (this.sales.today === 0) {
            const firstResult = await this.fetchSalesData("halfYear", SALES_CONSTANTS.INITIAL_BASIS);

            if (firstResult.count > 0) {
                const secondResult = await this.fetchSalesData("halfYear", firstResult.count + 1);
                if (secondResult.count > firstResult.count) {
                    this.sales.week = firstResult.count;
                    this.sales.halfYear = secondResult.count;
                } else {
                    this.sales.week = 0;
                    this.sales.halfYear = firstResult.count;
                }
            }
        } else {
            const weekResult = await this.fetchSalesData("halfYear", this.sales.today + 1);
            if (weekResult.count > this.sales.today) {
                this.sales.week = weekResult.count;
                const halfYearResult = await this.fetchSalesData("halfYear", weekResult.count + 1);
                this.sales.halfYear = halfYearResult.count || weekResult.count;
            } else {
                this.sales.week = this.sales.today;
                this.sales.halfYear = weekResult.count || this.sales.today;
            }
        }

        this.validateSalesData();

        return {
            productId: this.productId,
            name: this.productName,
            sales: { ...this.sales },
            stockQuantity: this.stockQuantity,
            salePrice: this.salePrice,
        };
    }

    private async fetchSalesData(label: string, basis: number, attempt = 1): Promise<{ count: number }> {
        return new Promise((resolve) => {
            const cmd = this.generateCurlCommand(basis);
            console.log(`[${label}] 요청 시작 - 상품ID: ${this.productId}, basis: ${basis}, 시도: ${attempt}`);

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    const isSSLError = stderr.includes("SSL") || stderr.includes("tlsv1 alert");
                    if (isSSLError && attempt < SALES_CONSTANTS.MAX_RETRIES) {
                        console.log(`🔁 [${label}] ${this.productId} SSL 오류. 재시도 (${attempt}/${SALES_CONSTANTS.MAX_RETRIES})`);
                        setTimeout(() => {
                            this.fetchSalesData(label, basis, attempt + 1).then(resolve);
                        }, 100 * attempt);
                        return;
                    }

                    console.warn(`[${label}] 요청 실패 - 상품ID: ${this.productId}, basis: ${basis}`);
                    resolve({ count: 0 });
                    return;
                }

                if (!stdout || stdout.trim() === "") {
                    console.warn(`[${label}] 응답이 비어 있음 - 상품ID: ${this.productId}, basis: ${basis}`);
                    if (attempt < SALES_CONSTANTS.MAX_RETRIES) {
                        setTimeout(() => {
                            this.fetchSalesData(label, basis, attempt + 1).then(resolve);
                        }, 1000 * attempt);
                        return;
                    }
                    resolve({ count: 0 });
                    return;
                }

                try {
                    const json = JSON.parse(stdout.trim());
                    const count = this.parseSalesCount(json);
                    console.log(`✅ [${label}] ${this.productId} 판매량: ${count}`);
                    resolve({ count });
                } catch (e) {
                    console.error(`[${label}] 파싱 오류 - 상품ID: ${this.productId}, basis: ${basis}`, (e as Error).message);
                    if (attempt < SALES_CONSTANTS.MAX_RETRIES) {
                        setTimeout(() => {
                            this.fetchSalesData(label, basis, attempt + 1).then(resolve);
                        }, 1000 * attempt);
                        return;
                    }
                    resolve({ count: 0 });
                }
            });
        });
    }

    private validateSalesData() {
        if (this.sales.week < this.sales.today) this.sales.week = this.sales.today;
        if (this.sales.halfYear < this.sales.week) this.sales.halfYear = this.sales.week;
    }

    private generateCurlCommand(basis: number): string {
        return `curl 'https://smartstore.naver.com/i/v1/marketing-message/${this.productId}?currentPurchaseType=Repaid&usePurchased=true&basisPurchased=${basis}' \
      -H 'accept: application/json, text/plain, */*' \
      -H 'referer: https://smartstore.naver.com/product/${this.productId}' \
      -H 'user-agent: Mozilla/5.0' \
      -b '${process.env.NAVER_COOKIE}'`;
    }

    private parseSalesCount(data: any): number {
        try {
            if (!data.mainPhrase) {
                console.warn(`판매량 데이터 없음 - 상품ID: ${this.productId}`);
                return 0;
            }

            const match = data.mainPhrase.match(/([\d,]+)명/);
            if (!match) {
                console.warn(`판매량 패턴 매칭 실패 - 상품ID: ${this.productId}, mainPhrase: ${data.mainPhrase}`);
                return 0;
            }

            return parseInt(match[1].replace(/,/g, ""));
        } catch (e) {
            console.error(`판매량 파싱 중 에러 - 상품ID: ${this.productId}:`, (e as Error).message);
            return 0;
        }
    }
}
