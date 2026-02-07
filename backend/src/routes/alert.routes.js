const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({ feature: "adaptive alerts ready" });
});

module.exports = router;
