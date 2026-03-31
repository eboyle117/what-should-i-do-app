async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  const token = await getSpotifyToken();

  const res = await fetch(
    "https://api.spotify.com/v1/browse/featured-playlists",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  const random =
    data.playlists.items[
      Math.floor(Math.random() * data.playlists.items.length)
    ];

  return Response.json({
    name: random.name,
    url: random.external_urls.spotify,
  });
}