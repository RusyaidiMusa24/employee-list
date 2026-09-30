"use server";
import { getEmployeeList } from "@/lib/employee-api";
import EmployeeList from "./components/employee-list";
import { fetchHost } from "@/lib/api";

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
    if (query) search.set("q", query);

    const request = new Request(`${await fetchHost()}/api/employees?${search}`);
    const employeeList = await (await getEmployeeList(request)).json();

    return <EmployeeList initialData={employeeList} params={params} />;
}
