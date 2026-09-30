"use server";

import { employeeSchema } from "@/lib/employee-api";
import { notFound } from "next/navigation";
import { EmployeeEditor, type EmployeeFormValues } from "../../employee-editor";

export default async function EditEmployeePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const response = await fetch("http://localhost:3000/api/employees/" + slug);
    const employeeParse = employeeSchema.safeParse(await response.json());

    if (!employeeParse.success) notFound();

    if (!employeeParse.success) notFound();
    const employee = employeeParse.data;
    return (
        <EmployeeEditor
            initialValues={{
                name: employee.name,
                email: employee.email,
                department:
                    employee.department as EmployeeFormValues["department"],
                role: employee.role,
                status: employee.status,
            }}
            backHref={`/employees/${employee.id}`}
        />
    );
}
