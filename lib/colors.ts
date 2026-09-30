import { Employee } from "./employee-api";

export const statusVariants: Record<
    Employee["status"],
    "success" | "warning" | "info" | "accent"
> = {
    "Full-Time": "success",
    "On-Leave": "warning",
    "Part-Time": "info",
    Intern: "accent",
};

const bgColors = [
    "bg-red-700/60",
    "bg-orange-700/60",
    "bg-amber-700/60",
    "bg-yellow-700/60",
    "bg-lime-700/60",
    "bg-green-700/60",
    "bg-emerald-700/60",
    "bg-teal-700/60",
    "bg-cyan-700/60",
    "bg-sky-700/60",
    "bg-blue-700/60",
    "bg-indigo-700/60",
    "bg-violet-700/60",
    "bg-purple-700/60",
    "bg-fuchsia-700/60",
    "bg-pink-700/60",
    "bg-rose-700/60",
];

export function getColorToken(value: string): string {
    if (!value) return "blue-600";

    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return bgColors[Math.abs(hash) % bgColors.length];
}
