"use client";

interface MonthSelectorProps {
    year: number;
    month: number;
    onChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [newYear, newMonth] = e.target.value.split("-").map(Number);
        onChange(newYear, newMonth);
    };

    const options: { year: number; month: number; label: string }[] = [];
    const now = new Date();
    const baseYear = now.getFullYear();
    const baseMonth = now.getMonth() + 1;

    for (let i = 0; i < 12; i++) {
        const totalMonth = baseMonth + i;
        const optYear = baseYear + Math.floor((totalMonth - 1) / 12);
        const optMonth = ((totalMonth - 1) % 12) + 1;
        options.push({
            year: optYear,
            month: optMonth,
            label: `${MONTH_NAMES[optMonth - 1]} ${optYear}`,
        });
    }

    return (
        <select
            value={`${year}-${month}`}
            onChange={handleChange}
            className="text-sm text-black border-2 border-black rounded-full px-3 py-1.5 focus:outline-none"
        >
            {options.map((opt) => (
                <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}