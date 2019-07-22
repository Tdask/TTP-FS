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
