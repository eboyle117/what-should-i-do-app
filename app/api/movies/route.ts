export async function GET() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await res.json();

  const movies = data.results.slice(0, 5).map((movie: any) => ({
    title: movie.title,
    poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  }));

  return Response.json(movies);
}