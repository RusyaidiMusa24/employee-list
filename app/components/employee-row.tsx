import { Employee } from "@/lib/employee-api";
import Link from "next/link";
import Pill from "./pill";
import { statusVariants, getColorToken } from "@/lib/colors";
import { initials } from "@/lib/text";

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
            <td className="items-center px-4 py-3">
                <span>
                    <Pill variant={statusVariants[employee.status]}>
                        {employee.status}
                    </Pill>
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
