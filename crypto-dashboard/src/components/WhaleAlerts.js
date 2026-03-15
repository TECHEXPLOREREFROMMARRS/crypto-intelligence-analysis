import React, { useEffect, useState } from "react";
import { getWhaleAlerts } from "../services/api";

function WhaleAlerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    const loadAlerts = () => {
      getWhaleAlerts().then(res => {
        setAlerts(res.data);
      });
    };

    loadAlerts();

    const interval = setInterval(loadAlerts, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={{border:"1px solid gray", padding:"20px", margin:"20px"}}>

      <h2>Whale Alerts</h2>

      {alerts.map((a, i) => (
        <div key={i} style={{marginBottom:"10px"}}>

          🚨 {a.message}

        </div>
      ))}

    </div>

  );

}

export default WhaleAlerts;