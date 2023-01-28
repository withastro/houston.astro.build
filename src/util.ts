export async function makeAskRequest(question: string) {
  
    // NOTE: this is a workaround for the fact that Netlify times out 10sec requests,
    // and sometimes these requests take longer than that.  Go back to "/api"
    // if we can get that limit bumped up.
    const res = await fetch('https://round-shape-acdb.pika.workers.dev/ask', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question })
    })
    if (!res.ok || res.status >= 400) {
      const { code, description } = await res.json();
      const e = new Error(description);
      e.cause = code;
      throw e;
    }
    const data = await res.json();
    if (data.code) {
      const { code, description } = data;
      const e = new Error(description);
      e.cause = code;
      throw e;
    }
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

export async function makeVoteRequest(vote: 0 | 1, question: string, answer: string) {
  // NOTE: this is a workaround for the fact that Netlify times out 10sec requests,
  // and sometimes these requests take longer than that.  Go back to "/api"
  // if we can get that limit bumped up.
  const res = await fetch('https://round-shape-acdb.pika.workers.dev/vote', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ vote, question, answer })
  })
  console.log(res.ok, res.status, await res.text());
}
