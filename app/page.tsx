"use server";
import { employeeListResponse } from "@/lib/employee-api";
import EmployeeList from "./components/employee-list";

type HomeProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;
    const search = new URLSearchParams({
        page: "1",
        limit: "10",
    });
    const query = typeof params.q === "string" ? params.q.trim() : "";
    console.log(query);
    if (query) search.set("q", query);
    const response = await fetch(
        "http://localhost:3000/api/employees?" + search,
    );
    const resultJson = await response.json();
    const employeeListResult = employeeListResponse.safeParse(resultJson);

    if (employeeListResult.success)
        return (
            <EmployeeList
                initialData={employeeListResult.data}
                params={params}
            />
        );
}
