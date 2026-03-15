from web3 import Web3

WHALE_THRESHOLD = 50  # ETH


def detect_whales(block):

    whales = []

    for tx in block["transactions"]:

        value_eth = Web3.from_wei(tx["value"], "ether")

        if value_eth >= WHALE_THRESHOLD:

            whales.append({
                "from": tx["from"],
                "to": tx["to"],
                "amount_eth": float(value_eth),
                "hash": tx["hash"].hex()
            })

    return whales