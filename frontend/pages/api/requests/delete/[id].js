export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const authHeader = req.headers.authorization || "";
  const backendUrl = `http://localhost:5000/api/requests/delete/${id}`;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authHeader
      },
      body: JSON.stringify(req.body || {})
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return res.status(response.status).send(payload);
  } catch (err) {
    return res.status(500).json({ error: "Proxy request failed" });
  }
}
