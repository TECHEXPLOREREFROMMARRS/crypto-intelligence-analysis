import React, { useState } from "react";
import { importCoin, searchCoins } from "../services/api";

function CoinImporter({ onImport }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingCoin, setImportingCoin] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await searchCoins(value);

      setResults(
        res.data.coins
          .filter((c) => c.market_cap_rank !== null && c.symbol.length <= 5)
          .slice(0, 5),
      );
    } catch {
      setResults([]);
    }

    setLoading(false);
  };

  const handleImport = async (coin) => {
    setImportingCoin(coin.id);
    setMessage("");

    try {
      await importCoin(coin.id);

      setMessage(`✅ ${coin.name} imported successfully`);

      setResults([]);

      if (onImport) onImport();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Import failed";

      setMessage(`❌ ${errorMsg}`);
    }

    setImportingCoin(coin.id);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        placeholder="Search coin..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #555",
          background: "#222",
          color: "white",
          width: "250px",
        }}
      />

      {loading && (
        <div style={{ marginTop: "5px", fontSize: "12px", color: "#aaa" }}>
          🔍 Searching coins...
        </div>
      )}

      {results.map((coin) => (
        <div
          key={coin.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: "#111",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "5px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={coin.thumb}
              alt=""
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />

            <span>
              {coin.name} ({coin.symbol.toUpperCase()})
            </span>
          </div>

          <button
            onClick={() => handleImport(coin)}
            disabled={importingCoin === coin.id}
            style={{
              background: "#22c55e",
              border: "none",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {importingCoin === coin.id ? "Importing..." : "Import"}
          </button>
        </div>
      ))}

      {message && (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>{message}</div>
      )}
    </div>
  );
}

export default CoinImporter;
