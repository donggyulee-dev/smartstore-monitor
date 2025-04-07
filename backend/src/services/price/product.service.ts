import { chromium } from "playwright";
import { Product } from "../../types/product.types";

export class ProductService {
    static async getProductList(storeUrl: string): Promise<Product[]> {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        });
        const page = await context.newPage();

        try {
            await page.goto(storeUrl);
            await page.waitForLoadState("networkidle");

            const scriptContent = await page.evaluate(() => {
                const scripts = Array.from(document.querySelectorAll("script"));
                const targetScript = scripts.find((s) => s.textContent?.includes("window.__PRELOADED_STATE__"));
                return targetScript?.textContent || "";
            });

            const jsonStr = scriptContent.replace("window.__PRELOADED_STATE__=", "").trim().replace(/;$/, "");
            const data = JSON.parse(jsonStr);
            const products = data?.widgetContents?.newProductWidget?.A?.data || [];

            const extracted: Product[] = products.map((p: any) => ({
                productId: p.productNo,
                name: p.name,
                salePrice: p.salePrice,
                stockQuantity: p.stockQuantity ?? 0,
            }));

            console.log(`✅ ${extracted.length}개 상품 추출 완료`);
            return extracted;
        } catch (e) {
            console.error("❌ 상품 목록 추출 중 에러:", (e as Error).message);
            return [];
        } finally {
            await browser.close();
        }
    }
}
