import { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid news response");
        }

        setNews(data);
      } catch (err) {
        console.error("CryptoNews error:", err);
        setError("Unable to load crypto news");
      }
    };

    loadNews();
  }, []);

  if (error) return <p className="news-error">{error}</p>;

  return (
    <div className="news-box">
      <h3>Latest Crypto News</h3>

      {news.length === 0 && <p>Loading news...</p>}

      {news.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="news-item"
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}
