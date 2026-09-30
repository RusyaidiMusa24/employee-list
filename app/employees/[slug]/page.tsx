"use server";
import { employeeSchema } from "@/lib/employee-api";
import { notFound } from "next/navigation";
import EmployeeDetails from "./employee-details";

export default async function EmployeePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const response = await fetch("http://localhost:3000/api/employees/" + slug);
    const employeeParse = employeeSchema.safeParse(await response.json());

    if (!employeeParse.success) notFound();

    return <EmployeeDetails employee={employeeParse.data} />;
}
