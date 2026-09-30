import { test, expect } from "@playwright/test";

test("can create a new employee", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /new employee/i }).click();

    await expect(page).toHaveURL(/\/employee\/new$/);

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Department").selectOption("Engineering");
    await page.getByLabel("Role").fill("Software Engineer");
    await page.getByLabel("Status").selectOption("Full-Time");

    await page.getByRole("button", { name: /create employee/i }).click();

    await expect(page).toHaveURL("/");
});
