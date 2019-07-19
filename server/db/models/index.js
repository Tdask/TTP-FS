const User = require("./user");
const Transaction = require("./transaction");

// here is where we make our associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  User,
  Transaction
};
