"use server";

import { getEmployeeById } from "@/lib/employee-api";
import { notFound } from "next/navigation";
import { EmployeeEditor, type EmployeeFormValues } from "../../employee-editor";

export default async function EditEmployeePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const employee = await getEmployeeById(slug);

    if (!employee) notFound();

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
