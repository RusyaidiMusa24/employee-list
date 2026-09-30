import employeeData from "@/data/employees.json";
import { z } from "zod";

const API_DELAY = 500;

export const employeeSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
    department: z.string(),
    status: z.enum(["Full-Time", "On-Leave", "Part-Time", "Intern"]),
});

export const employeesSchema = z.array(employeeSchema);

export const employees = employeesSchema.parse(employeeData);

const listQuerySchema = z.object({
    search: z.string().trim().default(""),
    department: z.string().default("all"),
    status: z.string().default("all"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export type Employee = z.infer<typeof employeeSchema>;

export async function applyApiDelay() {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
}

export function getForcedFailure(request: Request) {
    if (new URL(request.url).searchParams.get("search") !== "fail") {
        return null;
    }

    return Response.json(
        { error: "The employee service failed." },
        { status: 500 },
    );
}

export const employeeListResponse = z.object({
    data: employeesSchema,
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalUnfiltered: z.number(),
        totalPages: z.number(),
    }),
});

export type EmployeeListResponse = z.infer<typeof employeeListResponse>;

export function getEmployeeList(request: Request) {
    const params = new URL(request.url).searchParams;
    const parsedQuery = listQuerySchema.safeParse({
        search: params.get("search") ?? undefined,
        department: params.get("department") ?? undefined,
        status: params.get("status") ?? undefined,
        page: params.get("page") ?? undefined,
        limit: params.get("limit") ?? undefined,
    });

    if (!parsedQuery.success) {
        return Response.json(
            { error: "Invalid employee list query parameters." },
            { status: 400 },
        );
    }

    const { search, status, page, limit } = parsedQuery.data;
    const normalizedSearch = search.toLocaleLowerCase();
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            normalizedSearch.length === 0 ||
            `${employee.name} ${employee.role} ${employee.department}`
                .toLocaleLowerCase()
                .includes(normalizedSearch);
        const matchesStatus = status === "all" || employee.status === status;

        return matchesSearch && matchesStatus;
    });
    const start = (page - 1) * limit;

    return Response.json({
        data: filteredEmployees.slice(start, start + limit),
        pagination: {
            page,
            limit,
            total: filteredEmployees.length,
            totalUnfiltered: employees.length,
            totalPages: Math.ceil(filteredEmployees.length / limit),
        },
    } satisfies EmployeeListResponse);
}

export function getEmployeeById(id: string) {
    return employees.find((employee) => employee.id === id);
}
