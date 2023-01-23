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
        const message = await res.text();
        throw new Error(message);
    }
    const response = await res.json();

    if (response.answer.includes('don\'t know')) {
        return;
    }
    if (response.answer.includes('http') && !response.answer.includes('https://astro.build') && !response.answer.includes('https://docs.astro.build')) {
        return;
    }

    const [answer, sources] = response.answer.split(
      response.answer.includes("SOURCES:") ? "SOURCES:" : "Source:"
    ) as [string, string];
    
    const sourceList = sources
      .split(sources.includes("\n") ? "\n" : ",")
      .map((source) => {
        const href = source.trim()
        const label = href.replace('https://astro.build', 'Blog: ').replace('https://docs.astro.build/en', 'Docs: ');
        return [href, label]
      });

    return { answer: answer.trim(), sources: sourceList }
}
