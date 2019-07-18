const router = require("express").Router();
const Transaction = require("../db/models/transaction");

//mounted on /api/stock
router.post("/stock/search", async (req, res, next) => {
  const symbol = req.body;
  console.log(symbol);
  res.json(symbol);
  //here we make an api  call to IEX cloud using the searched ticker value from client
  //...in what syntax do we make our GET request to
});

router.post("stock/buy", async (req, res, next) => {
  const transaction = await Transaction.create(req.body);
  console.log("success");
  res.json(transaction);
});

router.use(function(req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
