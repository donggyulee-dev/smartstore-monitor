// src/pages/Dashboard.tsx
import { Layout } from "@/components/layout/Layout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";

export default function DashboardPage() {
    return (
        <Layout>
            <div className="space-y-8">
                <SummaryCards />
                <SalesTrendChart />
            </div>
        </Layout>
    );
}
