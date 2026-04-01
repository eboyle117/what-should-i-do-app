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

  // 🔥 use a popular playlist (Today’s Top Hits)
  const res = await fetch(
    "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  const tracks = data.tracks.items.slice(0, 5).map((item: any) => ({
    name: item.track.name,
    artist: item.track.artists[0].name,
    url: item.track.external_urls.spotify,
  }));

  return Response.json(tracks);
}