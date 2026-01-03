const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function fetchEvents() {
    console.log("API_BASE_URL:", API_BASE_URL);
    const url = `${API_BASE_URL}/events`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Failed to fetch events (${response.status}): ${body}`);
    }
    return response.json();
}
