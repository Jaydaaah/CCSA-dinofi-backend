

export async function RagRetrieve(prompt: string) {
    const res = await fetch("http://localhost:8888/?" +  new URLSearchParams({query_str: prompt}));
    if (res.ok) {
        const json: string[] = await res.json();
        return json;
    } else {
        return []
    }
}