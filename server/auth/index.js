const router = require("express").Router();
const { User } = require("../db/models");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      console.log("No such user found: ", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else if (!user.correctPassword(req.body.password)) {
      console.log("Incorrect password for user: ", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(error);
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", (req, res) => {
  res.json(req.user);
});

// put route to update user balance here ? router.put(/'me') ?
router.put("/me/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newBalance = Number(Object.keys(req.body));
    const response = await User.update(
      {
        balance: newBalance
      },
      {
        where: {
          id: userId
        },
        returning: true
      }
    );
    const updatedBalance = response[1][0].dataValues.balance;
    res.json(updatedBalance);
  } catch (error) {
    console.log(error);
  }
});
