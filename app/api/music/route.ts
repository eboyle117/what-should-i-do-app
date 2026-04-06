export async function GET() {
  try {
    const auth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("No token:", tokenData);
      return Response.json({ error: "No Spotify token" });
    }

    // ✅ USE SEARCH INSTEAD OF PLAYLIST
    const res = await fetch(
      "https://api.spotify.com/v1/search?q=top&type=track&limit=5",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const data = await res.json();

    console.log("SPOTIFY RESPONSE:", data);

    if (!data.tracks) {
      return Response.json({ error: "Bad Spotify data" });
    }

    const songs = data.tracks.items.map((track: any) => ({
    name: track.name,
    artist: track.artists[0].name,
    url: track.external_urls.spotify,
    image: track.album.images[0]?.url, // 👈 ADD THIS
    }));

    return Response.json(songs);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Spotify failed" });
  }
}