export function EmployeeRowSkeleton({ length }: { length: number }) {
    return (
        <div aria-label="Loading applicants" className="animate-pulse">
            {Array.from({ length }, (_, index) => (
                <div
                    key={index}
                    className="grid min-w-190 grid-cols-[25fr_12fr_15fr_15fr_40fr] gap-4 border-t border-border-subtle px-4 py-3"
                >
                    {Array.from({ length: 6 }, (__, cellIndex) => (
                        <div
                            key={cellIndex}
                            className="h-8 rounded bg-surface2"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
