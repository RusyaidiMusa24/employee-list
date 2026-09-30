import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { EmployeeListResponse } from "@/lib/employee-api";
import EmployeeList from "./employee-list";

const mockEmployees: EmployeeListResponse = {
    data: [
        {
            id: "1",
            name: "Jane Doe",
            email: "jane@example.com",
            department: "Engineering",
            role: "Software Engineer",
            status: "Full-Time",
        },
    ],
    pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        totalUnfiltered: 1,
    },
};

const emptyResponse: EmployeeListResponse = {
    data: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        totalUnfiltered: 0,
    },
};

function renderEmployeeList(initialData: EmployeeListResponse = mockEmployees) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <EmployeeList
                initialData={initialData}
                params={{
                    page: "1",
                    limit: "10",
                    search: undefined,
                    department: undefined,
                    status: undefined,
                }}
            />
        </QueryClientProvider>,
    );
}

describe("EmployeeList", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response(JSON.stringify(emptyResponse), {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }),
                ),
            ),
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("shows the empty state when the API returns no employees", async () => {
        renderEmployeeList(emptyResponse);

        expect(
            await screen.findByText("No Employees Added"),
        ).toBeInTheDocument();
    });
});

it("shows the error state when the API request fails", async () => {
    vi.stubGlobal(
        "fetch",
        vi.fn(() =>
            Promise.resolve(
                new Response("Internal Server Error", {
                    status: 500,
                }),
            ),
        ),
    );

    renderEmployeeList();

    expect(await screen.findByRole("alert")).toBeInTheDocument();

    expect(
        screen.getByText("Employees could not be loaded"),
    ).toBeInTheDocument();

    expect(
        screen.getByText("Check your connection and try again."),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
});
