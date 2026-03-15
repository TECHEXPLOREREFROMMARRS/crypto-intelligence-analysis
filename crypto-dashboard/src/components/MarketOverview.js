import React, { useEffect, useState } from "react";
import { getPriceHistory, getTokens } from "../services/api";

function MarketOverview() {

  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadMarket = async () => {

      try {

        const tokenRes = await getTokens();
        const tokens = tokenRes.data;

        const priceRequests = tokens.map(token =>
          getPriceHistory(token.name).then(res => ({
            token,
            prices: res.data
          }))
        );

        const responses = await Promise.all(priceRequests);

        const results = [];

        for (let { token, prices } of responses) {

          if (prices && prices.length > 1) {

            const latest = prices[prices.length - 1]?.price;
            const prev = prices[prices.length - 2]?.price;

            if (!latest || !prev) continue;

            const change = ((latest - prev) / prev) * 100;

            results.push({
              name: token.name,
              symbol: token.symbol || token.name,
              price: latest,
              change
            });

          }

        }

        setMarket(results);
        setLoading(false);

      } catch (err) {
        console.error("Market loading error:", err);
      }

    };

    loadMarket();

  }, []);

  if (loading) {
    return <div style={{ padding: "10px", color: "#aaa" }}>Loading market...</div>;
  }

  return (

    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "10px",
        borderBottom: "1px solid #444",
        marginBottom: "20px",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}
    >

      {market.map((m) => {

        const color = m.change >= 0 ? "#16c784" : "#ea3943";

        return (

          <div
            key={m.name}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              minWidth: "140px",
              fontSize: "14px"
            }}
          >

            <span style={{ fontWeight: "bold" }}>
              {(m.symbol || m.name).toUpperCase()}
            </span>

            <span>
              ${m.price?.toFixed(2)}
            </span>

            <span style={{ color }}>
              {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change).toFixed(2)}%
            </span>

          </div>

        );

      })}

    </div>

  );

}

export default MarketOverview;