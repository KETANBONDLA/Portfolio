export default async function handler(req, res) {
  const { title } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!title) {
    return res.status(400).json({ error: "Missing title parameter" });
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        title
      )}&language=en-US&include_adult=false`
    );

    const data = await tmdbRes.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ posterUrl: null });
    }

    const item = data.results[0];
    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null;

    return res.status(200).json({ posterUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
