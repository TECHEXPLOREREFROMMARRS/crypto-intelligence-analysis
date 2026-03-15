import React, { useEffect, useState } from "react";
import { getWhaleImpact } from "../services/api";

function WhaleImpact() {

  const [impact, setImpact] = useState(null);

  useEffect(() => {

    getWhaleImpact().then(res => {
      setImpact(res.data);
    });

  }, []);

  if (!impact) return <div>Loading whale analytics...</div>;

  const correlation = impact.whale_price_correlation;

  let level = "Low";

  if (correlation > 0.6) level = "High";
  else if (correlation > 0.3) level = "Moderate";

  return (

    <div style={{ textAlign: "center" }}>

      <h2>Whale Market Impact</h2>

      <div style={{ fontSize: "40px", fontWeight: "bold" }}>
        {(correlation * 100).toFixed(1)}%
      </div>

      <p>Influence Level: {level}</p>

      <p style={{ fontSize: "12px", color: "#aaa" }}>
        Rows analyzed: {impact.rows_analyzed}
      </p>

    </div>

  );

}

export default WhaleImpact;