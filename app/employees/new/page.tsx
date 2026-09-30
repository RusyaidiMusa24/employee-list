import { EmployeeEditor, emptyEmployeeValues } from "../employee-editor";

export default function NewEmployeePage() {
    return (
        <EmployeeEditor
            initialValues={emptyEmployeeValues}
            backHref="/"
            isNew
        />
    );
}
