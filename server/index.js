const express = require("express");
const app = express();
const models = require("./db/models");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./db");
const PORT = process.env.PORT || 3000;

// const createApp = () => {};

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", require("./api"));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const init = async () => {
  try {
    await models.User.sync();
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
  });
};

init();

module.exports = app;
