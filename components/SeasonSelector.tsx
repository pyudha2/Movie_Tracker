"use client";

export type AnimeSeason = "winter" | "spring" | "summer" | "fall";

interface SeasonSelectorProps {
    year: number;
    season: AnimeSeason;
    onChange: (year: number, season: AnimeSeason) => void;
}

const SEASON_ORDER: AnimeSeason[] = ["winter", "spring", "summer", "fall"];

const SEASON_LABELS: Record<AnimeSeason, string> = {
    winter: "Winter",
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
};

export default function SeasonSelector({ year, season, onChange }: SeasonSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [newYear, newSeason] = e.target.value.split("-");
        onChange(Number(newYear), newSeason as AnimeSeason);
    };

    const options: { year: number; season: AnimeSeason; label: string }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentSeasonIndex = Math.floor(now.getMonth() / 3);

    for (let i = 0; i < 8; i++) {
        const totalIndex = currentSeasonIndex - i;
        const yearOffset = Math.floor(totalIndex / 4);
        const seasonIndex = ((totalIndex % 4) + 4) % 4;
        const optYear = currentYear + yearOffset;
        const optSeason = SEASON_ORDER[seasonIndex];
        options.push({
            year: optYear,
            season: optSeason,
            label: `${SEASON_LABELS[optSeason]} ${optYear}`,
        });
    }

    return (
        <select
            value={`${year}-${season}`}
            onChange={handleChange}
            className="text-sm text-black border-2 border-black rounded-full px-3 py-1.5 focus:outline-none"
        >
            {options.map((opt) => (
                <option key={`${opt.year}-${opt.season}`} value={`${opt.year}-${opt.season}`}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}