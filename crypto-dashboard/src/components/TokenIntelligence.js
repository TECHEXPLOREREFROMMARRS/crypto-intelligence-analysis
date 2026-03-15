import React, { useEffect, useState } from "react";
import { getRisk, getPrediction, getWhaleImpact } from "../services/api";

function TokenIntelligence({ coin }) {

  const [risk, setRisk] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [impact, setImpact] = useState(null);

  useEffect(() => {

    getRisk(coin).then(res => setRisk(res.data));

    getPrediction(coin).then(res => setPrediction(res.data));

    getWhaleImpact().then(res => setImpact(res.data));

  }, [coin]);

  if (!risk || !prediction || !impact)
    return <div>Loading intelligence...</div>;

  const predicted = prediction.predicted_price_change;

  let trend = "Stable";

  if (predicted > 0.002) trend = "Uptrend";
  if (predicted < -0.002) trend = "Downtrend";

  const whaleCorr = impact.whale_price_correlation;

  let whaleLevel = "Low";

  if (whaleCorr > 0.6) whaleLevel = "High";
  else if (whaleCorr > 0.3) whaleLevel = "Moderate";

  return (

    <div style={{ textAlign: "center" }}>

      <h2>Token Intelligence</h2>

      <p><b>Prediction:</b> {trend}</p>
        
      <p><b>Volatility:</b> {risk.volatility ? risk.volatility.toFixed(4) : "N/A"}</p>

      <p><b>Whale Activity:</b> {whaleLevel}</p>

      <p><b>Risk Level:</b> {risk.risk_level}</p>

    </div>

  );

}

export default TokenIntelligence;