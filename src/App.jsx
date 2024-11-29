import React, { useState } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const url = `https://atlas.mappls.com/api/places/search/json?bridge=&query=${query}&location=28.627133913995547,77.23553525204144`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer 4bc7fb9f-d1e2-4b74-b1f7-ee0ada0c67b6",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data?.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>MapMyIndia Search</h1>
      <input
        type="text"
        value={query}
        placeholder="Enter query"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((item, index) => (
          <li key={index}>
            {item.placeName} - {item.placeAddress}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
