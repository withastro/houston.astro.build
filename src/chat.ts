const url = "https://round-shape-acdb.pika.workers.dev/ask";

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

    return data
}
