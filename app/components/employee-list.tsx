"use client";
import {
    Employee,
    EmployeeListResponse,
    employeeListResponse,
} from "@/lib/employee-api";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "./button";
import { AlertCircle, RotateCw } from "lucide-react";
import EmployeeRow from "./employee-row";
import { EmployeeRowSkeleton } from "./employee-skeleton";
import { Params } from "@/lib/types";
import z from "zod";
import { useRouter } from "next/navigation";

export type EmployeeFilters =
    "All" | "Full-Time" | "On-Leave" | "Part-Time" | "Intern";

const filters: { value: EmployeeFilters; label: string }[] = [
    { value: "All", label: "All" },
    { value: "Full-Time", label: "Full-Time" },
    { value: "On-Leave", label: "On-Leave" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Intern", label: "Intern" },
];

const employeeQueryParamsSchema = z.object({
    page: z.coerce.number().default(1),
    search: z.string().nullable().default(null),
    department: z.string().nullable().default(null),
    status: z.string().nullable().default(null),
    limit: z.coerce.number().default(10),
});

type EmployeeQueryParams = z.infer<typeof employeeQueryParamsSchema>;

export function useEmployees(
    params: EmployeeQueryParams,
    initialData?: EmployeeListResponse,
) {
    return useQuery({
        queryKey: ["employees-list", params],
        queryFn: async () => {
            const query = new URLSearchParams(
                Object.entries(params).flatMap(([key, value]) =>
                    !value ? [] : [[key, String(value)]],
                ),
            );
            // we have to set the current page url to the query
            const response = await fetch(`/api/employees?${query}`);

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            return employeeListResponse.parse(await response.json());
        },
        initialData,
    });
}

type EmployeeListProps = {
    initialData: EmployeeListResponse;
    params: Params;
};

export default function EmployeeList({
    initialData,
    params,
}: EmployeeListProps) {
    const safeParams = employeeQueryParamsSchema.safeParse(params);
    const [filter, setFilter] = useState<Employee["status"] | "All">("All");
    const inputTextRef = useRef("");
    const statusFilter = filter === "All" ? {} : { status: filter };

    const router = useRouter();

    const [pageParams, setPageParamsInternal] = useState<EmployeeQueryParams>(
        safeParams.success
            ? safeParams.data
            : {
                  page: 1,
                  limit: 10,
                  search: null,
                  department: null,
                  status: null,
              },
    );

    const employeesQuery = useEmployees(
        { ...pageParams, ...statusFilter },
        initialData,
    );

    const setPageParams = (params: EmployeeQueryParams) => {
        setPageParamsInternal(params);
        const query = new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) =>
                !value ? [] : [[key, String(value)]],
            ),
        );
        router.replace(`/?${query.toString()}`);
    };

    const result = employeesQuery.data;
    return (
        <div className="flex flex-1 flex-col items-center bg-bg-primary">
            <div className="my-8 w-[80%] rounded-xl bg-surface">
                <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-h2">Employees</h2>

                    <input
                        className="bg-bg-background text-body rounded-md border border-border px-4 py-1 text-secondary"
                        placeholder="Search name..."
                        defaultValue={pageParams.search ?? ""}
                        onChange={(e) =>
                            (inputTextRef.current = e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setPageParams({
                                    ...pageParams,
                                    search: inputTextRef.current,
                                });
                            }
                        }}
                    ></input>

                    <div
                        role="group"
                        aria-label="Filter applicants by stage"
                        className="flex flex-wrap gap-1"
                    >
                        {filters.map((item) => {
                            const count = result?.pagination.total ?? 0;
                            const active = filter === item.value;
                            return (
                                <Button
                                    key={item.value}
                                    type="button"
                                    size="sm"
                                    variant={active ? "primary" : "ghost"}
                                    aria-pressed={active}
                                    onClick={() => {
                                        setFilter(item.value);
                                        setPageParams({
                                            ...pageParams,
                                            page: 1,
                                        });
                                    }}
                                >
                                    {item.label}
                                    {active && !employeesQuery.isFetching && (
                                        <span className="rounded bg-black/15 px-1.5 py-0.5 text-[11px] text-surface tabular-nums">
                                            {count}
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <table className="w-full">
                    <colgroup>
                        <col className="w-[25%]" />
                        <col className="w-[12%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[40%]" />
                    </colgroup>
                    <thead>
                        <tr className="bg-bg-primary/50">
                            {[
                                "NAME",
                                "ROLE",
                                "DEPARTMENT",
                                "STATUS",
                                "E-MAIL",
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-4 py-3 text-[10px] font-medium tracking-[0.12em] text-tertiary"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {employeesQuery.isFetching ? (
                        <tbody>
                            <tr>
                                <td colSpan={6} className="p-0">
                                    <EmployeeRowSkeleton
                                        length={pageParams.limit}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    ) : employeesQuery.isError ? (
                        <tbody>
                            <tr>
                                <td colSpan={6} className="px-4 py-12">
                                    <div
                                        role="alert"
                                        className="mx-auto flex max-w-md flex-col items-center text-center"
                                    >
                                        <AlertCircle className="size-6 text-status-error" />
                                        <p className="mt-3 text-sm font-medium text-primary">
                                            Applicants could not be loaded
                                        </p>
                                        <p className="mt-1 text-sm text-secondary">
                                            Check your connection and try again.
                                        </p>
                                        <Button
                                            className="mt-4"
                                            variant="secondary"
                                            onClick={() =>
                                                void employeesQuery.refetch()
                                            }
                                        >
                                            <RotateCw data-icon="inline-start" />
                                            Retry
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    ) : result?.data?.length ? (
                        <tbody>
                            {result.data.map((employee) => (
                                <EmployeeRow
                                    key={employee.id}
                                    employee={employee}
                                />
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-14 text-center"
                                >
                                    <p className="text-sm font-medium text-primary">
                                        {params
                                            ? `No employees match "${pageParams.search}"`
                                            : filter === "All"
                                              ? "No applicants yet"
                                              : `No ${filters.find((item) => item.value === filter)?.label.toLowerCase()} applicants`}
                                    </p>
                                    <p className="mt-1 text-sm text-secondary">
                                        {params
                                            ? "Try another employee, role, or department."
                                            : filter === "All"
                                              ? "New applicants will appear here."
                                              : "Try another stage filter to see more applicants."}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    <tfoot></tfoot>
                </table>
            </div>
        </div>
    );
}
