import { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BACKEND}/news`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response");
        }
        setNews(data);
      })
      .catch((err) => {
        console.error("CryptoNews fetch error:", err);
        setError("Unable to load crypto news");
      });
  }, []);

  return (
    <aside className="crypto-news">
      <div className="news-title">Latest Crypto News</div>

      {error && (
        <div className="news-status error">
          {error}
        </div>
      )}

      {!error && news.length === 0 && (
        <div className="news-status">
          Loading news…
        </div>
      )}

      <ul className="news-list">
        {news.map((item, index) => (
          <li key={index} className="news-item">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
