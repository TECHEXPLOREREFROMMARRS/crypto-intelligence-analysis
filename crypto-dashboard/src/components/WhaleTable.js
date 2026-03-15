import React, { useEffect, useState } from "react";
import { getWhales } from "../services/api";

function WhaleTable() {

  const [whales, setWhales] = useState([]);

  useEffect(() => {
    getWhales().then(res => {
      setWhales(res.data.whale_transactions || []);
    });
  }, []);

  return (
    <div style={{border:"1px solid gray", padding:"20px", margin:"20px"}}>

      <h2>Recent Whale Transactions</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>ETH</th>
          </tr>
        </thead>

        <tbody>
          {whales.map((w, i) => (
            <tr key={i}>
              <td>{w.from}</td>
              <td>{w.to}</td>
              <td>{w.amount_eth}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default WhaleTable;