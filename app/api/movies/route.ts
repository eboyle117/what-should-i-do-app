export async function GET() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await res.json();

  const random =
    data.results[Math.floor(Math.random() * data.results.length)];

  return Response.json({
    title: random.title,
    overview: random.overview,
  });
}