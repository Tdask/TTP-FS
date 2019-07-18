const db = require("./db");

console.log("db inside models index: ", db);
//register models
require("./models");

module.exports = db;
