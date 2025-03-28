import React from "react";
import { SummaryCardProps } from "@/types/dashboard";
import { SUMMARY_DATA, ICON_MAP } from "@/constants/dashboard";

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {change && <p className={`text-sm mt-2 ${change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{change}</p>}
                </div>
                <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
            </div>
        </div>
    );
};

export const SummaryCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUMMARY_DATA.map((data) => (
                <SummaryCard
                    key={data.title}
                    title={data.title}
                    value={data.value}
                    change={data.change}
                    icon={<div className={`w-6 h-6 text-${data.color}-500`}>{React.createElement(ICON_MAP[data.icon as keyof typeof ICON_MAP])}</div>}
                />
            ))}
        </div>
    );
};
