import { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();

        if (!isMounted) return;

        setNews(data || []);
      } catch (err) {
        console.error("Crypto news fetch failed:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="crypto-news">
      <h3 className="news-title">📰 CryptoIQ News</h3>

      {loading && <p className="news-status">Loading latest news…</p>}

      {error && (
        <p className="news-status error">
          Unable to load news at the moment.
        </p>
      )}

      {!loading && !error && (
        <ul className="news-list">
          {news.map((item, index) => (
            <li key={index} className="news-item">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
