"use client";
import {
    Employee,
    EmployeeListResponse,
    employeeListResponse,
} from "@/lib/employee-api";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { AlertCircle, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import EmployeeRow from "./employee-row";
import { EmployeeRowSkeleton } from "./employee-skeleton";
import { Params } from "@/lib/types";
import z from "zod";
import Link from "next/link";

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
    initialParams?: EmployeeQueryParams,
) {
    return useQuery({
        queryKey: ["employees-list", params, params.status],
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
        initialData:
            initialParams &&
            JSON.stringify(initialParams) === JSON.stringify(params)
                ? initialData
                : undefined,
        staleTime: 30_000,
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
        (safeParams.success && safeParams.data) || undefined,
    );

    const setPageParams = (params: EmployeeQueryParams) => {
        setPageParamsInternal(params);
        const query = new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) =>
                !value ? [] : [[key, String(value)]],
            ),
        );
        window.history.replaceState(null, "", `?${query.toString()}`);
    };

    const result = employeesQuery.data;

    const pageSize = pageParams.limit;
    const page = pageParams.page;

    const firstResult = result?.pagination.total ? (page - 1) * pageSize : 0;
    const lastResult = Math.min(page * pageSize, result?.pagination.total ?? 0);
    return (
        <div className="flex flex-1 flex-col items-center bg-bg-primary">
            <div className="my-8 w-[80%] rounded-xl bg-surface">
                <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-h2">Employees</h2>

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

                <div className="flex flex-row justify-between px-4 py-4">
                    <Input
                        className="w-auto px-4 py-1 text-secondary"
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
                    />

                    <Link
                        href={"/employees/new"}
                        className="text-body-sm inline-flex items-center gap-2 text-secondary outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-accent-primary"
                    >
                        <Button variant={"secondary"}>+ New Employee</Button>
                    </Link>
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
                                            Employees could not be loaded
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
                                        {result?.pagination?.totalUnfiltered
                                            ? `No employees match "${pageParams.search}"`
                                            : "No Employees Added"}
                                    </p>
                                    <p className="mt-1 text-sm text-secondary">
                                        {params
                                            ? "Try another employee, role, or department."
                                            : "Press `+ New Employee` to get started."}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
                <footer className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-xs text-secondary">
                        Showing {firstResult}–{lastResult} of{" "}
                        {result?.pagination.total ?? 0} applicants
                    </p>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <label className="flex items-center gap-2 text-xs text-secondary">
                            Rows
                            <select
                                value={pageParams.limit}
                                onChange={(event) => {
                                    const limit = Number(event.target.value);
                                    const max = result?.pagination.total ?? 0;
                                    setPageParams({
                                        ...pageParams,
                                        limit: limit,
                                        page:
                                            limit * pageParams.page > max
                                                ? Math.floor(max / limit)
                                                : pageParams.page,
                                    });
                                }}
                                aria-label="Applicants per page"
                                className="h-8 rounded-md border border-border bg-bg-primary px-2 text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                            >
                                {[10, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-secondary">
                                Page {page} of{" "}
                                {result?.pagination.totalPages || 0}
                            </span>
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="secondary"
                                aria-label="Previous page"
                                disabled={page <= 1}
                                onClick={() =>
                                    setPageParams({
                                        ...pageParams,
                                        page: pageParams.page - 1,
                                    })
                                }
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="secondary"
                                aria-label="Next page"
                                disabled={
                                    page >=
                                    (result?.pagination?.totalPages ?? 0)
                                }
                                onClick={() =>
                                    setPageParams({
                                        ...pageParams,
                                        page: pageParams.page + 1,
                                    })
                                }
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
