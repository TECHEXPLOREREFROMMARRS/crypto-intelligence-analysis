import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getWhaleHistory } from "../services/api";

function WhaleChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWhaleHistory().then((res) => {
      const formatted = res.data.map((w) => ({
        time: new Date(w.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        eth: w.amount_eth,
      }));

      setData(formatted);
    });
  }, []);

  return (
    <div style={{ border: "1px solid gray", padding: "20px", margin: "20px" }}>
      <h2>Whale Activity</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />

          <XAxis dataKey="time" stroke="#ccc" />

          <YAxis stroke="#ccc" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="eth"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WhaleChart;
