export default async function handler(req, res) {
  console.log("Client-ID:", process.env.VITE_GAMES_CLIENT_ID ? "SET" : "MISSING");
  console.log("Token:", process.env.VITE_GAMES_AUTHORIZATION ? "SET" : "MISSING");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const response = await fetch(`https://api.igdb.com/v4/games/`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.VITE_GAMES_CLIENT_ID,
      Authorization: `Bearer ${process.env.VITE_GAMES_AUTHORIZATION}`,
      "Content-Type": "text/plain",
    },
    body: req.body,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}