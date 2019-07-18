const router = require("express").Router();
const { Transaction } = require("../db/models");

//mounted on /api/stock
router.post("/stock/search", async (req, res, next) => {
  const symbol = req.body;
  console.log(symbol);
  res.json(symbol);
  //here we make an api  call to IEX cloud using the searched ticker value from client
  //...in what syntax do we make our GET request to
});

router.post("/stock/buy", async (req, res, next) => {
  try {
    console.log("inside of buy: ", req.body);
    const transaction = await Transaction.create(req.body);
    console.log("transaction: ", transaction);
    // res.json(transaction);
  } catch (error) {
    console.log(error);
  }
});

router.use(function(req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
