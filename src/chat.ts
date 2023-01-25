// const url = "https://round-shape-acdb.pika.workers.dev/ask";
const url = "http://localhost:80/ask";

export async function chat(question: string) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question })
    })
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message);
    }
    const data = await res.json();
    const baseURLs = new Map();
    for (const source of data.sources) {
      const baseURL = source.url.split('#')[0];
      const arr = baseURLs.get(baseURL) || [];
      arr.push(source)
      baseURLs.set(baseURL, arr)
    }
    const sources = Array.from(baseURLs.values()).sort((a, b) => b.length - a.length).flat();

    return { ...data, sources }
}
