import axios from "axios";

const API_BASE = "https://crypto-intelligence-analysis-1.onrender.com";//"http://127.0.0.1:8000"

export const getPriceHistory = (coin) =>
  axios.get(`${API_BASE}/market/price-history?coin=${coin}`);

export const getPrediction = (coin) =>
  axios.get(`${API_BASE}/predict/volatility?coin=${coin}`);

export const getRisk = (coin) =>
  axios.get(`${API_BASE}/alerts/market-risk?coin=${coin}`);

export const getWhales = () =>
  axios.get(`${API_BASE}/whales/latest`);

export const getWhaleImpact = (coin) =>
  axios.get(`${API_BASE}/analytics/whale-impact?coin=${coin}`);

export const getWhaleHistory = () =>
  axios.get(`${API_BASE}/whales/history`);

export const getWhaleAlerts = () =>
  axios.get(`${API_BASE}/alerts/whale-alerts`);

export const getTokens = () =>
  axios.get(`${API_BASE}/tokens`);

export const importCoin = (coin) => {
  return axios.post(`${API_BASE}/import/historical`, null, {
    params: { coin }
  });
};

export const searchCoins = (query) =>
  axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);

