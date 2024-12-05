import fetch from "node-fetch";

export { calculatePrices };

async function getOracleReferencePrice(symbol) {
  const url = process.env.BASE_URL + "/price/" + symbol;
  const response = await fetch(url);
  const data = await response.json();

  return data?.data?.latest_price?.mark_price;
}

function calculateBidPrices(referencePrice, spreadPercentage, levels) {
  const bidPrices = [];

  for (let index = 0; index < levels; index++) {
    bidPrices.push(referencePrice * (1 - spreadPercentage * (index + 1)));
  }

  return bidPrices;
}

function calculateAskPrices(referencePrice, spreadPercentage, levels) {
  const askPrices = [];

  for (let index = 0; index < levels; index++) {
    askPrices.push(referencePrice * (1 + spreadPercentage * (index + 1)));
  }

  return askPrices;
}

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
