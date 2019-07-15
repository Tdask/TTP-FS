const path = require("path");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const sessionStore = new SequelizeStore({ db });
const app = express();
const models = require("./db/models");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

//passport registration
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const createApp = () => {
  //logging middleware
  app.use(morgan("dev"));

  //body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "a wildly insecure secret",
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //auth and api routes
  app.use("/api", require("./api"));
  app.use("/auth", require("./auth"));

  //static file serving middleware
  app.use(express.static(path.join(__dirname, "../public")));

  //any other requests with an extension (.js, .css) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  //serve up index.html
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  //error handling endware
  app.use(function(err, req, res, next) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

const syncDb = () => db.sync();

async function init() {
  try {
    await sessionStore.sync();
    await syncDb();
    await createApp();
    await startListening();
  } catch (error) {
    console.log(error);
  }
}

// const init = async () => {
//   try {
//     await models.User.sync();
//   } catch (error) {
//     console.log(error);
//   }
// };

init();

module.exports = app;
