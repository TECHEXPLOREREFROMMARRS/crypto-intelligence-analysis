import requests

COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price"

TOKENS = [
    "bitcoin",
    "ethereum",
    "solana",
    "polygon",
    "chainlink"
]


def get_market_prices():
    params = {
        "ids": ",".join(TOKENS),
        "vs_currencies": "usd"
    }

    response = requests.get(COINGECKO_URL, params=params)
    return response.json()