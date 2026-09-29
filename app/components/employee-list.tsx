"use client";
import { useState } from "react";
import { Button } from "./button";

export type EmployeeFilters =
    "all" | "fulltime" | "onleave" | "partitme" | "intern";

const filters: { value: EmployeeFilters; label: string }[] = [
    { value: "all", label: "All" },
    { value: "fulltime", label: "Full-Time" },
    { value: "onleave", label: "On-Leave" },
    { value: "partitme", label: "Part-Time" },
    { value: "intern", label: "Intern" },
];

export default function EmployeeList() {
    const [filter, setFilter] = useState<EmployeeFilters>("all");
    const [page, setPage] = useState(1);

    return (
        <div className="flex flex-1 flex-col items-center bg-bg-primary">
            <div className="mt-8 w-[80%] rounded-xl bg-surface">
                <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-h2">Employees</h2>

                    <input
                        className="bg-bg-background text-body rounded-md border border-border px-4 py-1 text-secondary"
                        placeholder="Search name..."
                    ></input>

                    <div
                        role="group"
                        aria-label="Filter applicants by stage"
                        className="flex flex-wrap gap-1"
                    >
                        {filters.map((item) => {
                            const count = 3;
                            const active = filter === item.value;
                            return (
                                <Button
                                    key={item.value}
                                    type="button"
                                    size="sm"
                                    variant={active ? "primary" : "ghost"}
                                    aria-pressed={active}
                                    onClick={() => {
                                        setFilter(item.value);
                                        setPage(1);
                                    }}
                                >
                                    {item.label}
                                    {active && (
                                        <span className="rounded bg-black/15 px-1.5 py-0.5 text-[11px] text-surface tabular-nums">
                                            {count}
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <table className="w-full">
                    <colgroup>
                        <col className="w-[25%]" />
                        <col className="w-[12%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[40%]" />
                    </colgroup>
                    <thead>
                        <tr className="bg-bg-primary/50">
                            {[
                                "NAME",
                                "ROLE",
                                "DEPARTMENT",
                                "STATUS",
                                "SOURCE",
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-4 py-3 text-[10px] font-medium tracking-[0.12em] text-tertiary"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            </div>
        </div>
    );
}
