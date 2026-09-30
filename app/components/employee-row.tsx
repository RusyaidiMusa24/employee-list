import { Employee } from "@/lib/employee-api";
import Link from "next/link";

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function EmployeeRow({ employee }: { employee: Employee }) {
    return (
        <tr className="border-t border-border-subtle transition-colors hover:bg-surface2/60">
            <td className="px-4 py-3">
                <Link
                    href={`/employee/${employee.id}`}
                    className="group flex min-w-48 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                    <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-primary ${getColorToken(employee.name)}`}
                    >
                        {initials(employee.name)}
                    </span>

                    <span className="block truncate text-sm font-medium text-primary group-hover:text-accent-primary">
                        {employee.name}
                    </span>
                </Link>
            </td>
            <td className="px-4 py-3">
                <span className="block max-w-44 truncate text-sm text-primary">
                    {employee.role}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className="mt-0.5 block text-xs text-tertiary">
                    {employee.department}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className="mt-0.5 block text-xs text-tertiary">
                    {employee.status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm whitespace-nowrap text-secondary">
                <span className="mt-0.5 block text-xs text-tertiary">
                    {employee.email}
                </span>
            </td>
        </tr>
    );
}

const colors = [
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

function getColorToken(value: string): string {
    if (!value) return "blue-600";

    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return colors[Math.abs(hash) % colors.length];
}
