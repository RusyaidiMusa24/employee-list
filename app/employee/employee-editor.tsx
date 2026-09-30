"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { z } from "zod";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { useRouter } from "next/navigation";

const departments = [
    "Engineering",
    "Design",
    "People",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "Product",
] as const;
const statuses = ["Full-Time", "On-Leave", "Part-Time", "Intern"] as const;

const formSchema = z.object({
    name: z.string().trim().min(1, "Enter an employee name."),
    email: z.string().trim().email("Enter a valid email address."),
    department: z.enum(departments),
    role: z.string().trim().min(1, "Enter a role."),
    status: z.enum(statuses),
});

export type EmployeeFormValues = z.infer<typeof formSchema>;

export const emptyEmployeeValues: EmployeeFormValues = {
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    status: "Full-Time",
};

type FieldName = keyof EmployeeFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;
type FieldDefinition = {
    name: FieldName;
    label: string;
    options?: readonly string[];
};

const fields: FieldDefinition[] = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "department", label: "Department", options: departments },
    { name: "role", label: "Role" },
    { name: "status", label: "Status", options: statuses },
];

export function EmployeeEditor({
    initialValues,
    backHref,
    isNew = false,
}: {
    initialValues: EmployeeFormValues;
    backHref: string;
    isNew?: boolean;
}) {
    const [errors, setErrors] = useState<FieldErrors>({});
    const router = useRouter();
    return (
        <main className="min-h-screen flex-1 bg-bg-primary px-4 py-8 text-primary sm:px-6">
            <div className="mx-auto max-w-4xl">
                <Link
                    href={backHref}
                    className="text-body-sm inline-flex items-center gap-2 text-secondary outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-tertiary"
                >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    {isNew ? "All employees" : "Employee profile"}
                </Link>

                <form
                    noValidate
                    className="mt-6 overflow-hidden rounded-lg border border-border bg-surface"
                    onSubmit={(event) => {
                        event.preventDefault();
                        const result = formSchema.safeParse(
                            Object.fromEntries(
                                new FormData(event.currentTarget),
                            ),
                        );

                        if (!result.success) {
                            const nextErrors: FieldErrors = {};
                            for (const issue of result.error.issues) {
                                const field = issue.path[0] as FieldName;
                                nextErrors[field] ??= issue.message;
                            }
                            setErrors(nextErrors);
                            return;
                        }
                        if (backHref != "/") router.back();

                        setErrors({});
                    }}
                >
                    <header className="flex flex-col gap-4 border-b border-border px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div>
                            <p className="text-body-sm text-secondary">
                                Employee details
                            </p>
                            <h1 className="text-h1 mt-1">
                                {isNew ? "New employee" : "Edit employee"}
                            </h1>
                        </div>
                        <Button type="submit" variant="primary">
                            <Check data-icon="inline-start" />
                            {isNew ? "Create employee" : "Save changes"}
                        </Button>
                    </header>

                    <div className="grid gap-x-8 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
                        {fields.map((field) => (
                            <EditorField
                                key={field.name}
                                {...field}
                                value={initialValues[field.name]}
                                error={errors[field.name]}
                                onChange={() =>
                                    setErrors((current) => ({
                                        ...current,
                                        [field.name]: undefined,
                                    }))
                                }
                            />
                        ))}
                    </div>
                </form>
            </div>
        </main>
    );
}

function EditorField({
    name,
    label,
    options,
    value,
    error,
    onChange,
}: FieldDefinition & {
    value: string;
    error?: string;
    onChange: () => void;
}) {
    const className = `text-body w-full rounded-md border bg-bg-primary px-3 py-2 text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${error ? "border-status-error" : "border-border"}`;

    return (
        <div>
            <label
                htmlFor={name}
                className="text-body-sm mb-2 block text-secondary"
            >
                {label}
            </label>
            {options ? (
                <select
                    id={name}
                    name={name}
                    defaultValue={value}
                    className={className}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                    onChange={onChange}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <Input
                    id={name}
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    defaultValue={value}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                    onChange={onChange}
                />
            )}
            {error && (
                <p
                    id={`${name}-error`}
                    className="text-body-sm mt-1 text-status-error"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
