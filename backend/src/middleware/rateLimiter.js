const rateLimit = require("express-rate-limit");

const createLimiter = (opts = {}) => {
  return rateLimit({
    windowMs: opts.windowMs || 60 * 1000, // 1 minute default
    max: opts.max || 10, // requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, try again later." },
    ...opts.extra,
  });
};

module.exports = { createLimiter };
