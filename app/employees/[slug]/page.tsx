"use server";
import { getEmployeeById } from "@/lib/employee-api";
import { notFound } from "next/navigation";
import EmployeeDetails from "./employee-details";

export default async function EmployeePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const employee = await getEmployeeById(slug);

    if (!employee) notFound();

    return <EmployeeDetails employee={employee} />;
}
