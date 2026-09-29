"use server";
import EmployeeList from "./components/employee-list";

export default async function Home() {
    // todo: async fetch, prefill EmployeeList with initialData
    return <EmployeeList />;
}
