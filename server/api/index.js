const router = require("express").Router();

router.use("/portfolio", require("./portfolio"));

router.use(function(req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
