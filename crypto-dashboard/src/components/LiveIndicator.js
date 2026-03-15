import React, { useEffect, useState } from "react";

function LiveIndicator() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        fontSize: "14px"
      }}
    >

      <span style={{ color: "limegreen", fontSize: "18px" }}>
        ●
      </span>

      <span>
        LIVE DATA STREAM
      </span>

      <span style={{ color: "#aaa" }}>
        Last update: {time.toLocaleTimeString()}
      </span>

    </div>

  );

}

export default LiveIndicator;