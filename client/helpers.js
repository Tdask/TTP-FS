export const calculateTotal = (batchRes, portfolio) => {
  //need to iterate through either portfolio or batchRes, get currItem's quantity and currItem's currentPrice, multiply and add to overall total value on each iteration
  let totalValue = 0;
  for (let item in batchRes) {
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
    return [
      { color: "green" },
      {
        img:
          "https://images.emojiterra.com/google/android-nougat/512px/2b06.png"
      }
    ];
  }
  if (currPrice === openPrice) {
    return [
      { color: "grey" },
      {
        img:
          "https://images.emojiterra.com/google/android-nougat/512px/27a1.png"
      }
    ];
  }
  if (currPrice < openPrice) {
    return [
      { color: "red" },
      {
        img:
          "https://images.emojiterra.com/google/android-nougat/512px/2b07.png"
      }
    ];
  }
};

export const portfolioMaker = transactions => {
  const portfolio = {};
  transactions.forEach(trans => {
    if (!portfolio[trans.symbol]) {
      portfolio[trans.symbol] = { quantity: trans.quantity };
    } else {
      const prevQuantity = portfolio[trans.symbol].quantity;
      portfolio[trans.symbol] = { quantity: prevQuantity + trans.quantity };
    }
  });
  return portfolio;
};

export const quantityChecker = (propsP, stateP) => {
  if (Object.keys(propsP).length !== Object.keys(stateP).length) {
    return false;
  }

  for (let symbol in propsP) {
    if (propsP[symbol].quantity > stateP[symbol].quantity) {
      return false;
    }
  }
  return true;
};
