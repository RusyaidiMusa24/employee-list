import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outputPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../data/employees.json",
);

const firstNames = [
    "Avery",
    "Blake",
    "Cameron",
    "Dakota",
    "Elliot",
    "Finley",
    "Harper",
    "Jordan",
    "Kai",
    "Logan",
    "Morgan",
    "Noah",
    "Parker",
    "Quinn",
    "Reese",
    "Riley",
    "Rowan",
    "Sage",
    "Skyler",
    "Taylor",
    "Valerie",
    "Wesley",
    "Xavier",
    "Yasmin",
    "Zoe",
];

const lastNames = [
    "Adams",
    "Bennett",
    "Chen",
    "Diaz",
    "Ellis",
    "Foster",
    "Garcia",
    "Hayes",
    "Ibrahim",
    "Jensen",
    "Kim",
    "Lopez",
    "Martin",
    "Nguyen",
    "Owens",
    "Patel",
    "Reed",
    "Singh",
    "Turner",
    "Williams",
];

const departments = [
    "Engineering",
    "Design",
    "People",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "Product",
];

const rolesByDepartment = {
    Engineering: ["Software Engineer", "QA Engineer", "Engineering Manager"],
    Design: ["Product Designer", "UX Researcher", "Design Lead"],
    People: ["People Partner", "Recruiter", "HR Coordinator"],
    Finance: ["Financial Analyst", "Accountant", "Finance Manager"],
    Marketing: ["Content Strategist", "Brand Designer", "Marketing Manager"],
    Operations: ["Operations Associate", "Program Manager", "Office Manager"],
    Sales: ["Account Executive", "Sales Development Rep", "Sales Manager"],
    Product: ["Product Manager", "Product Analyst", "Product Operations Lead"],
};

const statuses = ["Full-Time", "On-Leave", "Part-Time", "Intern"];

const employees = Array.from({ length: 500 }, (_, index) => {
    const department = departments[index % departments.length];
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length)];

    return {
        id: `emp-${String(index + 1).padStart(4, "0")}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName}${lastName}@email.com`.toLowerCase(),
        role: rolesByDepartment[department][
            Math.floor(index / departments.length) %
                rolesByDepartment[department].length
        ],
        department,
        status: statuses[index % statuses.length],
    };
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(employees, null, 2)}\n`);
console.log(`Generated ${employees.length} employees at ${outputPath}`);
