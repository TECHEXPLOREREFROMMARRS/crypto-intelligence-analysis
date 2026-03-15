import React, { useEffect, useState } from "react";
import { getPriceHistory } from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function PriceChart({ coin }) {

  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {

    const loadData = () => {

      getPriceHistory(coin).then((res) => {

        const prices = res.data;

        const formatted = prices
          .filter((_, i) => i % 5 === 0)
          .map((p) => ({
            time: new Date(p.timestamp).getTime(),
            price: p.price
          }));

        setData(formatted);

        if (prices.length > 1) {

          const latest = prices[prices.length - 1].price;
          const previous = prices[prices.length - 2].price;

          setCurrentPrice(latest);
          setPriceChange(((latest - previous) / previous) * 100);

        }

      });

    };

    loadData();

    const interval = setInterval(loadData, 10000);

    return () => clearInterval(interval);

  }, [coin]);

  const changeColor = priceChange >= 0 ? "green" : "red";

  return (

    <div style={{ border: "1px solid gray", padding: "20px", margin: "20px" }}>

      <h2>{coin.toUpperCase()} Market</h2>

      {/* Market Stats */}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        fontSize: "18px"
      }}>

        <div>
          Price: <b>${currentPrice.toFixed(2)}</b>
        </div>

        <div style={{ color: changeColor }}>
          {priceChange.toFixed(2)}%
        </div>

      </div>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid stroke="#333" strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            stroke="#ccc"
            tickFormatter={(time) =>
              new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            }
          />

          <YAxis stroke="#ccc" />

          <Tooltip
            labelFormatter={(time) =>
              new Date(time).toLocaleTimeString()
            }
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#4ade80"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default PriceChart;