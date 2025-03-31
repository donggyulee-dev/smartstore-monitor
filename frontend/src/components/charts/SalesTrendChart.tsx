// src/components/charts/SalesTrendChart.tsx
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { DateSelector } from "./DateSelector";
import { SALES_TREND_DATA } from "@/data/sales";
import { getToday, getYesterday, isWithinLastNDays } from "@/utils/date";

export const SalesTrendChart = () => {
    const [selectedRange, setSelectedRange] = useState("오늘");

    const filteredData = SALES_TREND_DATA.filter((item) => {
        switch (selectedRange) {
            case "오늘":
                return item.date === getToday();
            case "어제":
                return item.date === getYesterday();
            case "최근 7일":
                return isWithinLastNDays(item.date, 7);
            case "최근 30일":
                return isWithinLastNDays(item.date, 30);
            default:
                return true;
        }
    })
        .map((item) => ({
            hour: `${String(item.hour).padStart(2, "0")}시`,
            orderCount: item.orderCount,
        }))
        .sort((a, b) => Number(a.hour.replace("시", "")) - Number(b.hour.replace("시", "")));

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">시간대별 판매 트렌드</h2>
                <DateSelector selected={selectedRange} onChange={setSelectedRange} />
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        label={{
                            value: "주문 수",
                            angle: -90,
                            position: "insideLeft",
                            offset: -20,
                        }}
                    />
                    <Tooltip formatter={(value: number) => [`${value}건`, "주문 수"]} labelFormatter={(label) => `${label} 기준`} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="orderCount" name="주문 수" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
