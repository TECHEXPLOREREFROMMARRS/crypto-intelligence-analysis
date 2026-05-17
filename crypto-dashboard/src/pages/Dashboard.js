import React, { useState, useEffect } from "react";
import { getTokens } from "../services/api";
import Card from "../components/Card";
import RiskGauge from "../components/RiskGauge";
import PriceChart from "../components/PriceChart";
import WhaleChart from "../components/WhaleChart";
import WhaleAlerts from "../components/WhaleAlerts";
import WhaleTable from "../components/WhaleTable";
import WhaleImpact from "../components/WhaleImpact";
import TokenIntelligence from "../components/TokenIntelligence";
import LiveIndicator from "../components/LiveIndicator";
import MarketTicker from "../components/MarketTicker";
import CoinImporter from "../components/CoinImporter";
import AIInsight from "../components/AIInsight";
import MarketSummary from "../components/MarketSummary";

function Dashboard() {
  const [coin, setCoin] = useState("");
  const [tokens, setTokens] = useState([]);

const loadTokens = React.useCallback(async () => {
  try {
    const res = await getTokens();
    const list = res.data;

    setTokens(list);

    if (list.length > 0 && !coin) {
      setCoin(list[0].name);
    }
  } catch (err) {
    console.error("Failed to load tokens", err);
  }
}, []);

/* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-6 text-blue-400">
        Crypto Intelligence Dashboard
      </h1>

      

      {/* Market ticker */}
      <MarketTicker />

      {/* Import coin */}
      <CoinImporter onImport={loadTokens} />

      {/* Live status indicator */}
      <LiveIndicator />

      {/* Coin Selector */}
      <div className="mb-6">
        <label className="mr-3 font-semibold">Select Coin:</label>

        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="bg-gray-800 p-2 rounded"
        >
          {tokens.map((t) => (
            <option key={t.id} value={t.name}>
              {t.symbol.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
     
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-2 gap-6">

        <Card title="Market Risk">
          {coin && <RiskGauge coin={coin} />}
        </Card>

        <Card title="Price Chart">
          {coin && <PriceChart coin={coin} />}
        </Card>

        <Card title="Whale Activity">
          {coin && <WhaleChart coin={coin} />}
        </Card>

        <Card title="AI Market Insight">
          {coin && <AIInsight coin={coin} />}
        </Card>

        <Card title="Whale Alerts">
          <WhaleAlerts />
        </Card>
       
         <MarketSummary coin={coin} />
      </div>

      {/* Token intelligence */}
      <Card title="Token Intelligence">
        {coin && <TokenIntelligence coin={coin} />}
      </Card>

      {/* Whale impact */}
      <Card title="Whale Impact">
        {coin && <WhaleImpact coin={coin} />}
      </Card>

      {/* Whale transactions */}
      <div className="mt-6">
        <Card title="Whale Transactions">
          <WhaleTable />
        </Card>
      </div>

    </div>
  );
}

export default Dashboard;