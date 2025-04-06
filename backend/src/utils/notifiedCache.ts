import fs from "fs";
import path from "path";

export class NotifiedCache {
    private cache: Set<string>;
    private readonly filePath: string;
    private readonly maxSize: number;

    constructor(fileName: string, maxSize: number = 10000) {
        this.filePath = path.join(__dirname, "../../data", fileName);
        this.maxSize = maxSize;
        this.cache = new Set();
        this.load();
    }

    private load(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, "utf-8");
                this.cache = new Set(data.split("\n").filter((id) => id.trim()));
                console.log(`[cache] ${this.cache.size}개의 항목 로드 완료`);
            } else {
                // 디렉토리가 없으면 생성
                const dir = path.dirname(this.filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            }
        } catch (error) {
            console.error("[cache] 로드 실패:", error);
            this.cache = new Set();
        }
    }

    private save(): void {
        try {
            const data = Array.from(this.cache).join("\n");
            fs.writeFileSync(this.filePath, data);
        } catch (error) {
            console.error("[cache] 저장 실패:", error);
        }
    }

    public has(id: string): boolean {
        return this.cache.has(id);
    }

    public add(id: string): void {
        this.cache.add(id);
        this.save();

        // 캐시 크기 관리
        if (this.cache.size > this.maxSize) {
            const idsArray = Array.from(this.cache);
            this.cache = new Set(idsArray.slice(-this.maxSize));
            this.save();
        }
    }

    public addMany(ids: string[]): void {
        ids.forEach((id) => this.cache.add(id));
        this.save();

        // 캐시 크기 관리
        if (this.cache.size > this.maxSize) {
            const idsArray = Array.from(this.cache);
            this.cache = new Set(idsArray.slice(-this.maxSize));
            this.save();
        }
    }

    public size(): number {
        return this.cache.size;
    }

    public clear(): void {
        this.cache.clear();
        this.save();
    }
}
