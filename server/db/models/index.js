const User = require("./user");
const Transaction = require("./transaction");

// associations
//
User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  User,
  Transaction
};
