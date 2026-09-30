import { getEmployeeList, getForcedFailure } from "@/lib/employee-api";

export async function GET(request: Request) {
    const failure = getForcedFailure(request);
    if (failure) return failure;

    return await getEmployeeList(request);
}
