import {
    applyApiDelay,
    getEmployeeList,
    getForcedFailure,
} from "@/lib/employee-api";

export async function GET(request: Request) {
    await applyApiDelay();
    const failure = getForcedFailure(request);
    if (failure) return failure;

    return await getEmployeeList(request);
}
