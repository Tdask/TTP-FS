const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-express")(session.Store);
const dbStore = new SequelizeStore({ db: db });
const passport = require("passport");
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
app.use("/auth", require("./auth"));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    store: dbStore,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
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
