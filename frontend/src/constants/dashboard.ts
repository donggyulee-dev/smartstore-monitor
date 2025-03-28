import { BarChart3, DollarSign, MessageSquare, Package } from "lucide-react";
import { SummaryData } from "@/types/dashboard";

export const SUMMARY_DATA: SummaryData[] = [
    {
        title: "당일 판매량",
        value: "245",
        change: "+15.3%",
        icon: "BarChart3",
        color: "blue",
    },
    {
        title: "당일 매출",
        value: "₩4,850,000",
        change: "+18.7%",
        icon: "DollarSign",
        color: "green",
    },
    {
        title: "미답변 문의",
        value: "23",
        change: "-5.2%",
        icon: "MessageSquare",
        color: "orange",
    },
    {
        title: "재고 부족 상품",
        value: "7",
        change: "+2",
        icon: "Package",
        color: "red",
    },
];

export const ICON_MAP = {
    BarChart3,
    DollarSign,
    MessageSquare,
    Package,
} as const;
