import React, { useEffect, useState } from "react";
import { getTokens, getPriceHistory } from "../services/api";

function MarketTicker() {

  const [market, setMarket] = useState([]);

  useEffect(() => {

    const loadMarket = async () => {

      const tokenRes = await getTokens();
      const tokens = tokenRes.data;

      const results = [];

      for (let token of tokens) {

        const res = await getPriceHistory(token.name);
        const prices = res.data;

        if (prices.length > 1) {

          const latest = prices[prices.length - 1].price;
          const prev = prices[prices.length - 2].price;

          const change = ((latest - prev) / prev) * 100;

          results.push({
            symbol: token.symbol,
            price: latest,
            change
          });

        }

      }

      setMarket(results);

    };

    loadMarket();

  }, []);

  const tickerItems = [...market, ...market]; // duplicate for infinite loop

  return (

    <div
      style={{
        background: "#111",
        padding: "8px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        borderBottom: "1px solid #333"
      }}
    >

      <div className="ticker-track">

        {tickerItems.map((m, i) => {

          const color = m.change >= 0 ? "limegreen" : "red";

          return (

            <span
              key={i}
              style={{ marginRight: "40px", display: "inline-block" }}
            >

              <b>{m.symbol.toUpperCase()}</b>

              {" $" + m.price.toFixed(2)}

              <span style={{ color }}>
                {" "}{m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change).toFixed(2)}%
              </span>

            </span>

          );

        })}

      </div>

    </div>

  );

}

export default MarketTicker;