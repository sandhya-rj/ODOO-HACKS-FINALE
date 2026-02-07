module.exports = (...roles) => (req, res, next) => {
  const userRole = req.headers["x-role"] || "LEARNER";

  if (!roles.includes(userRole)) {
    return res.status(403).json({ error: "forbidden" });
  }

  next();
};
