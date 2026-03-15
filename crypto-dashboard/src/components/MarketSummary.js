import React, { useEffect, useState } from "react";
import { getRisk, getPrediction, getWhaleImpact } from "../services/api";

function MarketSummary({ coin }) {

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    const loadSummary = async () => {

      try {

        const riskRes = await getRisk(coin);
        const predRes = await getPrediction(coin);
        const whaleRes = await getWhaleImpact(coin);

        const risk = riskRes.data;
        const prediction = predRes.data.predicted_price_change;
        const whale = whaleRes.data;

        let trend;

        if (prediction > 0.01) trend = "Strong Uptrend";
        else if (prediction > 0.002) trend = "Uptrend";
        else if (prediction < -0.01) trend = "Strong Downtrend";
        else if (prediction < -0.002) trend = "Downtrend";
        else trend = "Sideways";

        let whaleActivity;

        if (!whale.whale_data_available)
          whaleActivity = "No whale data";
        else if (whale.whale_price_correlation > 0.5)
          whaleActivity = "High";
        else if (whale.whale_price_correlation > 0.2)
          whaleActivity = "Moderate";
        else
          whaleActivity = "Low";

        let volatility;

        if (risk.volatility > 0.02)
          volatility = "High";
        else if (risk.volatility > 0.005)
          volatility = "Moderate";
        else
          volatility = "Low";

        setSummary({
          trend,
          volatility,
          whaleActivity,
          risk: risk.risk_level
        });

      } catch {
        setSummary(null);
      }

    };

    loadSummary();

  }, [coin]);

  if (!summary) return null;

  return (

    <div style={{
      border: "1px solid #444",
      padding: "15px",
      borderRadius: "6px",
      background: "#111",
      marginBottom: "20px"
    }}>

      <h2>Market Intelligence Summary</h2>

      <p><b>Trend:</b> {summary.trend}</p>
      <p><b>Volatility:</b> {summary.volatility}</p>
      <p><b>Whale Activity:</b> {summary.whaleActivity}</p>
      <p><b>Risk Level:</b> {summary.risk}</p>

    </div>

  );

}

export default MarketSummary;