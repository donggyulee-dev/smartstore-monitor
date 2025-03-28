export interface SummaryData {
    title: string;
    value: string | number;
    change?: string;
    icon: string;
    color: string;
}

export interface SummaryCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
}
