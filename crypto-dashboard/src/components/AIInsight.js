import React, { useEffect, useState } from "react";
import { getRisk, getPrediction, getWhaleImpact } from "../services/api";

function AIInsight({ coin }) {
  const [insight, setInsight] = useState("Analyzing market data...");

  useEffect(() => {
    const generateInsight = async () => {
      try {

        const [riskRes, predRes, whaleRes] = await Promise.all([
          getRisk(coin),
          getPrediction(coin),
          getWhaleImpact(coin),
        ]);

        const risk = riskRes.data;
        const prediction = predRes.data.predicted_price_change || 0;

        const whaleCorr = whaleRes.data.whale_price_correlation || 0;
        const whaleAvailable = whaleRes.data.whale_data_available;

        let messages = [];

        if (!whaleAvailable) {
          messages.push("No whale activity data available for this asset.");
        } else if (whaleCorr > 0.5) {
          messages.push(
            "Whale activity is strongly influencing price movements."
          );
        } else if (whaleCorr > 0.2) {
          messages.push("Whale activity has moderate influence on the market.");
        } else {
          messages.push("Whale activity influence appears low.");
        }

        if (risk.volatility > 0.02)
          messages.push("Market volatility is currently elevated.");
        else
          messages.push("Market volatility remains relatively low.");

        if (prediction > 0.002)
          messages.push("The ML model predicts a short-term upward trend.");
        else if (prediction < -0.002)
          messages.push("The ML model predicts a short-term downward trend.");
        else
          messages.push("Price movement is expected to remain stable.");

        messages.push(`Overall market risk is ${risk.risk_level}.`);

        setInsight(messages.join(" "));
      } catch {
        setInsight("Unable to generate AI insight.");
      }
    };

    generateInsight();
  }, [coin]);

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: "15px",
        borderRadius: "6px",
        background: "#111",
      }}
    >
      <h2>AI Market Insight</h2>

      <p style={{ lineHeight: "1.6" }}>{insight}</p>
    </div>
  );
}

export default AIInsight;