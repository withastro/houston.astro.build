export async function makeAskRequest(question: string) {
  // NOTE: this is a workaround for the fact that Netlify times out 10sec requests,
  // and sometimes these requests take longer than that.  Go back to "/api"
  // if we can get that limit bumped up.
  const res = await fetch("https://round-shape-acdb.pika.workers.dev/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ question }),
  });
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
    const baseURL = source.url.split("#")[0];
    const arr = baseURLs.get(baseURL) || [];
    arr.push(source);
    baseURLs.set(baseURL, arr);
  }
  const sources = Array.from(baseURLs.values())
    .sort((a, b) => b.length - a.length)
    .flat();

  return { ...data, sources };
}

export async function makeVoteRequest(
  vote: 0 | 1,
  question: string,
  answer: string,
  sources: string[]
) {
  // NOTE: this is a workaround for the fact that Netlify times out 10sec requests,
  // and sometimes these requests take longer than that.  Go back to "/api"
  // if we can get that limit bumped up.
  const res = await fetch("https://round-shape-acdb.pika.workers.dev/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ vote, question, answer, sources }),
  });
}

// MIT License

// Copyright (c) 2022-present, Elk contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
export function markdown(input: string): string {
  return input
    .replace(
      /(```|~~~)(\w*)([\s\S]+?)\1/g,
      (_1, _2, lang: string, raw: string) => {
        const code = raw
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/`/g, "&#96;");
        const classes = lang ? ` class="language-${lang}"` : "";
        return `<pre><code${classes}>${code.trim()}</code></pre>`;
      }
    )
    .replace(/`([^`\n]*)`/g, (_1, raw) => {
      return raw
        ? `<code>${raw.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`
        : "";
    })
    .replace(/\*\*(.*?)\*\*/g, (_2, raw) => `<b>${raw}</b>`)
    .replace(/\*(.*?)\*/g, (_3, raw) => `<em>${raw}</em>`);
}
