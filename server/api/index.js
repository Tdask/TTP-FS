const router = require("express").Router();
const { Transaction } = require("../db/models");

//mounted on /api/stock
router.post("/stock/search", async (req, res, next) => {
  const symbol = req.body;
  res.json(symbol);
  //here we make an api  call to IEX cloud using the searched ticker value from client
  //...in what syntax do we make our GET request to
});

router.post("/stock/buy", async (req, res, next) => {
  try {
    console.log(req.body);
    const userId = req.user.dataValues.id;
    req.body.userId = userId;
    console.log("req.body", req.body);
    const transaction = await Transaction.create(req.body);
    // console.log(
    //   "TOTAL: ",
    //   transaction.dataValues.price * transaction.dataValues.quantity
    // );
    res.json(transaction);
  } catch (error) {
    console.log(error);
  }
});

router.get("/stock/transactions", async (req, res, next) => {
  try {
    let idToSearch = req.user.dataValues.id;
    const transactions = await Transaction.findAll({
      where: {
        userId: idToSearch
      }
    });
    // console.log("returned transactions: ", transactions);
    //const transactions = //Sequelize query to find all transactions where userId = :userId
    res.json(transactions);
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
