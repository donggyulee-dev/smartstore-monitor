// src/components/charts/DateSelector.tsx

interface DateSelectorProps {
    selected: string;
    onChange: (value: string) => void;
}

const options = ["오늘", "어제", "최근 7일", "최근 30일"];

export const DateSelector: React.FC<DateSelectorProps> = ({ selected, onChange }) => {
    return (
        <div className="mb-4">
            <select value={selected} onChange={(e) => onChange(e.target.value)} className="border rounded px-3 py-2">
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};
