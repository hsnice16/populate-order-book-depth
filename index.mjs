import "dotenv/config";
import { calculatePrices, createOrder, placeOrder } from "./utils.mjs";
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
  for (const price in bidPrices) {
    const order = createOrder(
      "L",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "M"
    );

    await placeOrder({}, order);
  }

  console.log("eth -- sell orders");

  // Place orders for sell (Short)
  for (const price in askPrices) {
    const order = createOrder(
      "S",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "M"
    );

    await placeOrder({}, order);
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
  for (const price in bidPrices) {
    const order = createOrder(
      "L",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "M"
    );

    await placeOrder({}, order);
  }

  console.log("btc -- sell orders");

  // Place orders for sell (Short)
  for (const price in askPrices) {
    const order = createOrder(
      "S",
      LEVERAGE,
      price,
      LEVEL_LIQUIDITY,
      symbol,
      "M"
    );

    await placeOrder({}, order);
  }
}
