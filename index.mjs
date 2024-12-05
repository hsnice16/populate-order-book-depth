import "dotenv/config";
import { calculatePrices } from "./utils.mjs";
import { SPREAD_PERCENTAGE, NUM_LEVELS } from "./constant.mjs";

const { bidPrices, askPrices } = await calculatePrices(
  "eth",
  SPREAD_PERCENTAGE,
  NUM_LEVELS
);

console.log("bidPrices", bidPrices);
console.log("askPrices", askPrices);
