import {
    applyApiDelay,
    getEmployeeById,
    getForcedFailure,
} from "@/lib/employee-api";

export async function GET(
    request: Request,
    { params }: RouteContext<"/api/employees/[id]">,
) {
    await applyApiDelay();
    const failure = getForcedFailure(request);
    if (failure) return failure;

    const { id } = await params;
    const employee = await getEmployeeById(id);

    if (!employee) {
        return Response.json({ error: "Employee not found." }, { status: 404 });
    }

    return Response.json(employee);
}
