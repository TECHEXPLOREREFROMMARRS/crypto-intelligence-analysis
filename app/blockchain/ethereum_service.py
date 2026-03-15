from web3 import Web3

RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/FVAxoDbBZn5kE96HrpMio"

w3 = Web3(Web3.HTTPProvider(RPC_URL))


def is_connected():
    return w3.is_connected()


def get_latest_block():
    return w3.eth.block_number

def get_block_with_transactions(block_number):
    return w3.eth.get_block(block_number, full_transactions=True)