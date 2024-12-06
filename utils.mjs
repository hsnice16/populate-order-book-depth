import fetch from "node-fetch";
import { ethers } from "ethers";

export { calculatePrices, placeOrder, createOrder, createHeader };

async function calculatePrices(symbol, spreadPercentage, levels) {
  const referencePrice = await getOracleReferencePrice(symbol);

  const bidPrices = calculateBidPrices(
    referencePrice,
    spreadPercentage,
    levels
  );

  const askPrices = calculateAskPrices(
    referencePrice,
    spreadPercentage,
    levels
  );

  return {
    bidPrices,
    askPrices,
  };
}

/**
 * 
 * @param {Object} headers { 
    X-Platform: string; 
    X-Chain-EVM-Id: string; 
    X-Nonce: string; 
    X-Signature: string 
  }
 * 
 * @param {Object} data { 
    direction: "L" | "S";
    expiry_time: number;
    leverage: number;
    price: number;
    quantity: number;
    slippage: number | undefined;
    symbol: string;
    type: "M" | "L";
  }
 */
async function placeOrder(headers, data) {
  const url = process.env.BASE_URL + "/order/create";
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const jsonData = await response.json();

  if (jsonData.success) {
    return jsonData.data;
  } else {
    return jsonData.msg;
  }
}

/**
 *
 * @param {string} direction "L" | "S"
 * @param {number} leverage 2
 * @param {number} price 3222
 * @param {number} amount 20000
 * @param {string} symbol "ETH" | "BTC"
 * @param {string} type "M" | "L"
 * @param {number} priceDecimal 1
 * @returns
 */
function createOrder(
  direction,
  leverage,
  price,
  amount,
  symbol,
  type,
  priceDecimal
) {
  price = parseFloat(price.toFixed(priceDecimal));
  const quantity = parseFloat((amount / price).toFixed(priceDecimal));

  return {
    direction,
    expiry_time: 17000000000,
    leverage,
    symbol,
    type,
    slippage: 2,
    price,
    quantity,
  };
}

/**
 *
 * @param {Object} order Order Data
 * @returns
 */
async function createHeader(order) {
  const payload = JSON.stringify(order);

  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(process.env.EXCHANGE_BASED_PRIVATE_KEY);

  // Get timestamp as nonce
  const timestamp = Date.now();
  const signature = await wallet.signMessage(`${payload}${timestamp}`);

  return {
    "X-Platform": "turbox",
    "X-Chain-EVM-Id": 421614,
    "X-Nonce": timestamp,
    "X-Signature": signature,
  };
}

function calculateAskPrices(referencePrice, spreadPercentage, levels) {
  const askPrices = [];

  for (let index = 0; index < levels; index++) {
    askPrices.push(referencePrice * (1 + spreadPercentage * (index + 1)));
  }

  return askPrices;
}

function calculateBidPrices(referencePrice, spreadPercentage, levels) {
  const bidPrices = [];

  for (let index = 0; index < levels; index++) {
    bidPrices.push(referencePrice * (1 - spreadPercentage * (index + 1)));
  }

  return bidPrices;
}

async function getOracleReferencePrice(symbol) {
  const url = process.env.BASE_URL + "/price/" + symbol;
  const response = await fetch(url);
  const data = await response.json();

  return data?.data?.latest_price?.mark_price;
}
