const router = require("express").Router();
const { Transaction } = require("../db/models");
const fs = require("fs");

//mounted on /api/stock

router.post("/stock/search", async (req, res, next) => {
  const symbol = req.body;
  res.json(symbol);
});

router.post("/stock/buy", async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    req.body.userId = userId;
    const transaction = await Transaction.create(req.body);
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
