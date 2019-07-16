const Sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define("transaction", {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
});

module.exports = Transaction;
//ticker symbol, price (when bought), quantity ==> can use these 2 tables to display total price of transaction on front end, no real reason to make another column in db right?
