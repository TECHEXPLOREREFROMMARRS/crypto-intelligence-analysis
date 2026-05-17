import React, { useEffect, useState } from "react";
import { getRisk } from "../services/api";


function RiskGauge({ coin = "ethereum" }) {

  const [risk, setRisk] = useState(null);

  useEffect(() => {
    getRisk(coin)
      .then(res => {
        console.log(res.data);
        setRisk(res.data);
      })
      .catch(err => console.error(err));
  }, [coin]);

  if (!risk) {
    return <p className="text-gray-400 text-center">Loading risk...</p>;
  }



  if (risk.risk_level === "medium") color = "text-yellow-400";
  if (risk.risk_level === "high") color = "text-red-400";

return (
  <div style={{ textAlign: "center" }}>

    <h2>Market Risk</h2>

    <div style={{ fontSize: "40px", fontWeight: "bold" }}>
      {risk.risk_score}
    </div>

    <p>Level: {risk.risk_level}</p>

    {/* Risk Meter */}

    <div
      style={{
        width: "100%",
        height: "15px",
        background: "#333",
        borderRadius: "10px",
        marginTop: "10px"
      }}
    >
      <div
        style={{
          width: `${risk.risk_score}%`,
          height: "100%",
          borderRadius: "10px",
          background:
            risk.risk_score > 70
              ? "#ef4444"
              : risk.risk_score > 30
              ? "#f59e0b"
              : "#22c55e"
        }}
      />
    </div>

    <p style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
      Volatility: {risk.volatility ? risk.volatility.toFixed(4) : "N/A"}
    </p>

  </div>
);
}

export default RiskGauge;