import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const body = await request.text();
  const data = await fetch("http://34.82.133.90/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
  });
  return data;
};
