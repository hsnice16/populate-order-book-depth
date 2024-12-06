import "dotenv/config";

import {
  calculatePrices,
  createOrder,
  placeOrder,
  createHeader,
} from "./utils.mjs";

import {
  SPREAD_PERCENTAGE,
  NUM_LEVELS,
  LEVERAGE,
  LEVEL_LIQUIDITY,
} from "./constant.mjs";

await populateEthOrderBook();
await populateBtcOrderBook();

async function populateEthOrderBook() {
  const symbol = "ETH";

  const { bidPrices, askPrices } = await calculatePrices(
    symbol,
    SPREAD_PERCENTAGE,
    NUM_LEVELS
  );

  console.log("eth -- bidPrices", bidPrices);
  console.log("eth -- askPrices", askPrices);

  console.log("eth -- buy orders");

  // Place orders for buy (Long)
  for (const price of bidPrices) {
    const order = createOrder(
      "L",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "L",
      2
    );

    const header = await createHeader(order);
    const orderNo = await placeOrder(header, order);

    console.log("orderNo -- ", orderNo);
  }

  console.log("eth -- sell orders");

  // Place orders for sell (Short)
  for (const price of askPrices) {
    const order = createOrder(
      "S",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "L",
      2
    );

    const header = await createHeader(order);
    const orderNo = await placeOrder(header, order);

    console.log("orderNo -- ", orderNo);
  }
}

async function populateBtcOrderBook() {
  const symbol = "BTC";

  const { bidPrices, askPrices } = await calculatePrices(
    symbol,
    SPREAD_PERCENTAGE,
    NUM_LEVELS
  );

  console.log("btc -- bidPrices", bidPrices);
  console.log("btc -- askPrices", askPrices);

  console.log("btc -- buy orders");

  // Place orders for buy (Long)
  for (const price of bidPrices) {
    const order = createOrder(
      "L",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "L",
      1
    );

    const header = await createHeader(order);
    const orderNo = await placeOrder(header, order);

    console.log("orderNo -- ", orderNo);
  }

  console.log("btc -- sell orders");

  // Place orders for sell (Short)
  for (const price of askPrices) {
    const order = createOrder(
      "S",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "L",
      1
    );

    const header = await createHeader(order);
    const orderNo = await placeOrder(header, order);

    console.log("orderNo -- ", orderNo);
  }
}
