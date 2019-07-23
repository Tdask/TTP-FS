export const calculateTotal = (batchRes, portfolio) => {
  console.log("arg1: ", batchRes, "arg2: ", portfolio);
  //need to iterate through either portfolio or batchRes, get currItem's quantity and currItem's currentPrice, multiply and add to overall total value on each iteration
  let totalValue = 0;
  for (let item in batchRes) {
    // console.log("iterating in helper: ", item);
    const price = batchRes[item].quote.latestPrice;
    const quantity = portfolio[item].quantity;
    totalValue += price * quantity;
  }
  return totalValue;
};

export const decimalCleaner = num => {
  const splitVal = String(num).split(".");
  while (splitVal[1] && splitVal[1].length < 2) splitVal[1] += "0";
  if (!splitVal[1]) {
    splitVal.push("00");
  }
  return splitVal[0] + "." + splitVal[1].slice(0, 2);
};

export const performance = (openPrice, currPrice) => {
  if (currPrice > openPrice) {
    return { color: "green" };
  }
  if (currPrice === openPrice) {
    return { color: "grey" };
  }
  if (currPrice < openPrice) {
    return { color: "red" };
  }
};

export const portfolioMaker = transactions => {
  console.log("inside of portfoliomaker helper", transactions);

  const portfolio = {};
  transactions.forEach(trans => {
    // console.log("iterated trans: ", trans);
    if (!portfolio[trans.symbol]) {
      portfolio[trans.symbol] = { quantity: trans.quantity };
    } else {
      const prevQuantity = portfolio[trans.symbol].quantity;
      portfolio[trans.symbol] = { quantity: prevQuantity + trans.quantity };
    }
  });

  return portfolio;
};
