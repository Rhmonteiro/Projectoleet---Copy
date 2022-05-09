import time
import base64
import hmac
import hashlib
import requests
import pprint
import kucoin
#
#   api_key = "61d2df564f30840001b220a8"
#    api_secret = "aa8a5783-c91e-4eaf-9941-58a4ec9a8d54"
#    api_passphrase = "Testing31pw"
#    url = 'https://openapi-sandbox.kucoin.com/api/v1/accounts'
#    now = int(time.time() * 1000)
#    str_to_sign = str(now) + 'GET' + '/api/v1/accounts'
#    signature = base64.b64encode(
#        hmac.new(api_secret.encode('utf-8'), str_to_sign.encode('utf-8'), hashlib.sha256).digest())
#    passphrase = base64.b64encode(hmac.new(api_secret.encode('utf-8'), api_passphrase.encode('utf-8'), hashlib.sha256).digest())
#    headers = {
#        "KC-API-SIGN": signature,
#        "KC-API-TIMESTAMP": str(now),
#        "KC-API-KEY": api_key,
#        "KC-API-PASSPHRASE": passphrase,
#        "KC-API-KEY-VERSION": "2"
#    }
#    response = requests.request('get', url, headers=headers)
#    print(response.status_code)
#    print(response.json())
#
#    pprint.pprint(response.json())



#    api_key = "61d2e3fc2b968a000152d951"
#    api_secret = "4f9aa9b4-ac44-48ae-b77b-2b01b4dbcfd6"
#    api_passphrase = "sandboxpw31"
#    url = 'https://openapi-sandbox.kucoin.com/api/v1/accounts'
#    now = int(time.time() * 1000)
#    str_to_sign = str(now) + 'GET' + '/api/v1/accounts'
#    signature = base64.b64encode(
#        hmac.new(api_secret.encode('utf-8'), str_to_sign.encode('utf-8'), hashlib.sha256).digest())
#    passphrase = base64.b64encode(hmac.new(api_secret.encode('utf-8'), api_passphrase.encode('utf-8'), hashlib.sha256).digest())
#    headers = {
#        "KC-API-SIGN": signature,
#        "KC-API-TIMESTAMP": str(now),
#        "KC-API-KEY": api_key,
#        "KC-API-PASSPHRASE": passphrase,
#        "KC-API-KEY-VERSION": "2"
#    }
#    response = requests.request('get', url, headers=headers)
#    print(response.status_code)
#    print(response.json())
#
#    pprint.pprint(response.json())




#  MarketData
from kucoin.client import Market
#client = Market(url='https://api.kucoin.com')
# client = Market()

# or connect to Sandbox
#client = Market(url='https://openapi-sandbox.kucoin.com')
client = Market(is_sandbox=True)

# get symbol kline
klines = client.get_kline('BTC-USDT','1min')

# get symbol ticker
server_time = client.get_server_timestamp()

api_key = '61d2e3fc2b968a000152d951'
api_secret = '4f9aa9b4-ac44-48ae-b77b-2b01b4dbcfd6'
api_passphrase = 'sandboxpw31'

# Trade
from kucoin.client import Trade
#client = Trade(key='', secret='', passphrase='', is_sandbox=False, url='')

# or connect to Sandbox
client = Trade(api_key, api_secret, api_passphrase, is_sandbox=True)

# place a limit buy order
order_id = client.create_limit_order('BTC-USDT', 'buy', '1', '8000')

# place a market buy order   Use cautiously
order_id = client.create_market_order('BTC-USDT', 'buy', size='1')

# cancel limit order
client.cancel_order('5bd6e9286d99522a52e458de')

# User
from kucoin.client import User
# client = User(api_key, api_secret, api_passphrase)

# or connect to Sandbox
client = User(api_key, api_secret, api_passphrase, is_sandbox=True)

address = client.get_withdrawal_quota('KCS')