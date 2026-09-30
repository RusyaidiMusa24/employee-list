import { headers } from "next/headers";
export async function fetchHost(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get("host");
    if (!host) {
        throw new Error("Unable to determine request host");
    }
    const protocol =
        headersList.get("x-forwarded-proto") ??
        (process.env.NODE_ENV === "development" ? "http" : "https");
    return `${protocol}://${host}`;
}
