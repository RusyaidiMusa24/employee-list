"use server";

import { Button } from "@/app/components/button";
import Pill from "@/app/components/pill";
import type { Employee } from "@/lib/employee-api";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const statusVariants: Record<
    Employee["status"],
    "success" | "warning" | "info" | "accent"
> = {
    "Full-Time": "success",
    "On-Leave": "warning",
    "Part-Time": "info",
    Intern: "accent",
};

export default async function EmployeeDetails({
    employee,
}: {
    employee: Employee;
}) {
    const initials = employee.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <main className="min-h-screen flex-1 bg-bg-primary px-4 py-8 text-primary sm:px-6">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/"
                    className="text-body-sm inline-flex items-center gap-2 text-secondary transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    All employees
                </Link>

                <section className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
                    <header className="flex flex-col gap-5 border-b border-border px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div className="flex min-w-0 items-center gap-4">
                            <div
                                aria-hidden="true"
                                className="text-h2 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface2 text-accent-primary"
                            >
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-body-sm text-secondary">
                                    Employee profile
                                </p>
                                <h1 className="text-h1 mt-1 truncate">
                                    {employee.name}
                                </h1>
                            </div>
                        </div>
                        <Link href={`/employees/${employee.id}/edit`}>
                            <Button
                                type="button"

                                variant="primary"
                            >
                                <Pencil data-icon="inline-start" />
                                Edit details
                            </Button>
                        </Link>
                    </header>

                    <dl className="grid gap-x-8 gap-y-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
                        <Detail label="Email">{employee.email}</Detail>
                        <Detail label="Department">
                            {employee.department}
                        </Detail>
                        <Detail label="Role">{employee.role}</Detail>
                        <Detail label="Status">
                            <Pill variant={statusVariants[employee.status]}>
                                {employee.status}
                            </Pill>
                        </Detail>
                        <Detail label="Employee ID">{employee.id}</Detail>
                    </dl>
                </section>
            </div>
        </main>
    );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="text-body-sm text-secondary">{label}</dt>
            <dd className="text-body mt-1 break-all text-primary">
                {children}
            </dd>
        </div>
    );
}
