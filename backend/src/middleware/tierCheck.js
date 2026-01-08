module.exports = function tierCheck(req, res, next) {
  if (!req.tier) {
    return res
      .status(403)
      .json({ message: "No valid subscription/tier found" });
  }

  if (!req.tier.allowsCheckIn) {
    return res
      .status(403)
      .json({ message: "Check-in not allowed for this tier" });
  }

  next();
};
