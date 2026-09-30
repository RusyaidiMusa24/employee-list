// EmployeeEditor.test.tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmployeeEditor, emptyEmployeeValues } from "./employee-editor";

const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockBack,
    }),
}));

describe("EmployeeEditor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows validation errors when required fields are empty", async () => {
        const user = userEvent.setup();

        render(
            <EmployeeEditor
                initialValues={emptyEmployeeValues}
                backHref="/"
                isNew
            />,
        );

        await user.click(
            screen.getByRole("button", { name: /create employee/i }),
        );

        expect(screen.getByText("Enter an employee name.")).toBeInTheDocument();

        expect(
            screen.getByText("Enter a valid email address."),
        ).toBeInTheDocument();

        expect(screen.getByText("Enter a role.")).toBeInTheDocument();
    });

    it("shows an email validation error for an invalid email", async () => {
        const user = userEvent.setup();

        render(
            <EmployeeEditor
                initialValues={{
                    ...emptyEmployeeValues,
                    name: "Jane Doe",
                    email: "not-an-email",
                    role: "Designer",
                }}
                backHref="/"
                isNew
            />,
        );

        await user.click(
            screen.getByRole("button", { name: /create employee/i }),
        );

        expect(
            screen.getByText("Enter a valid email address."),
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Enter an employee name."),
        ).not.toBeInTheDocument();

        expect(screen.queryByText("Enter a role.")).not.toBeInTheDocument();
    });

    it("clears a field error when the user changes that field", async () => {
        const user = userEvent.setup();

        render(
            <EmployeeEditor
                initialValues={emptyEmployeeValues}
                backHref="/"
                isNew
            />,
        );

        await user.click(
            screen.getByRole("button", { name: /create employee/i }),
        );

        expect(screen.getByText("Enter an employee name.")).toBeInTheDocument();

        const nameInput = screen.getByRole("textbox", {
            name: "Name",
        });

        await user.type(nameInput, "Jane Doe");

        expect(
            screen.queryByText("Enter an employee name."),
        ).not.toBeInTheDocument();
    });

    it("does not navigate when validation fails", async () => {
        const user = userEvent.setup();

        render(
            <EmployeeEditor
                initialValues={emptyEmployeeValues}
                backHref="/employees"
                isNew
            />,
        );

        await user.click(
            screen.getByRole("button", { name: /create employee/i }),
        );

        expect(mockBack).not.toHaveBeenCalled();
    });

    it("navigates back after a valid edit", async () => {
        const user = userEvent.setup();

        render(
            <EmployeeEditor
                initialValues={{
                    name: "Jane Doe",
                    email: "jane@example.com",
                    department: "Design",
                    role: "Product Designer",
                    status: "Full-Time",
                }}
                backHref="/employees"
            />,
        );

        await user.click(screen.getByRole("button", { name: /save changes/i }));

        expect(mockBack).toHaveBeenCalledOnce();
    });
});
