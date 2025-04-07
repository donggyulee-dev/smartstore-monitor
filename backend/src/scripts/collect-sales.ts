import { writeFileSync } from "fs";
import { join } from "path";
import { SalesCollector } from "../services/sales/collector.service";
import { ProductService } from "../services/price/product.service";
import { PRICE_CONSTANTS } from "../constants/price.constants";
import { SalesResult } from "../types/product.types";
import { STORES } from "../constants/store.constants";
import { StoreConfig } from "../types/store.types";

class SalesCollectionError extends Error {
    constructor(message: string, public readonly store: StoreConfig) {
        super(message);
        this.name = "SalesCollectionError";
    }
}

async function collectSalesForStore(store: StoreConfig): Promise<void> {
    try {
        const today = new Date().toISOString().split("T")[0];
        const storeId = new URL(store.url).pathname.split("/")[1];

        console.log(`📦 ${store.name} 상품 목록 불러오는 중... (${store.url})`);
        const products = await ProductService.getProductList(store.url);

        if (!products || products.length === 0) {
            throw new SalesCollectionError("상품 목록을 가져오지 못했습니다", store);
        }

        const summary: SalesResult[] = [];

        for (let i = 0; i < products.length; i += PRICE_CONSTANTS.BATCH_SIZE) {
            const batch = products.slice(i, i + PRICE_CONSTANTS.BATCH_SIZE);
            console.log(`📊 처리 중: ${i + 1} - ${i + batch.length}/${products.length}`);

            try {
                const batchResults = await Promise.all(
                    batch.map(async (product) => {
                        const collector = new SalesCollector(product.productId, product.name, product.stockQuantity);
                        const result = await collector.collectSalesData();
                        return { ...result, salePrice: product.salePrice };
                    })
                );

                summary.push(...batchResults);

                if (i + PRICE_CONSTANTS.BATCH_SIZE < products.length) {
                    await new Promise((resolve) => setTimeout(resolve, PRICE_CONSTANTS.BATCH_DELAY));
                }
            } catch (error: unknown) {
                console.error(`❌ 배치 처리 중 에러 발생 (${store.name}):`, error instanceof Error ? error.message : error);
                // 배치 처리 실패 시에도 계속 진행
            }
        }

        if (summary.length === 0) {
            throw new SalesCollectionError("수집된 데이터가 없습니다", store);
        }

        const fileName = `sales_summary_${storeId}_${today}.json`;
        const filePath = join(process.cwd(), "data", fileName);
        writeFileSync(filePath, JSON.stringify(summary, null, 2), "utf-8");
        console.log(`📁 결과 저장 완료: ${filePath}`);
    } catch (error: unknown) {
        if (error instanceof SalesCollectionError) {
            throw error;
        }
        throw new SalesCollectionError(`데이터 수집 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`, store);
    }
}

async function main() {
    const targetStoreName = process.argv[2];
    const storesToProcess = targetStoreName ? STORES.filter((store) => store.name === targetStoreName) : STORES;

    if (storesToProcess.length === 0) {
        console.error(`❌ 지정된 스토어를 찾을 수 없습니다: ${targetStoreName}`);
        process.exit(1);
    }

    let hasError = false;

    for (const store of storesToProcess) {
        try {
            await collectSalesForStore(store);
        } catch (error: unknown) {
            hasError = true;
            if (error instanceof SalesCollectionError) {
                console.error(`❌ ${store.name} 처리 중 에러 발생:`, error.message);
            } else {
                console.error(`❌ ${store.name} 처리 중 예상치 못한 에러 발생:`, error);
            }
        }
    }

    if (hasError) {
        process.exit(1);
    }
}

// 프로그램 실행
main().catch((error: unknown) => {
    console.error("프로그램 실행 중 치명적 오류 발생:", error instanceof Error ? error.message : error);
    process.exit(1);
});
