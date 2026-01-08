
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const SECRET = process.env.JWT_SECRET || "supersecret";
const QR_EXP_SECONDS = parseInt(process.env.QR_TOKEN_EXP_SECONDS || "60", 10);

/**
 * Creates a QR token for a specific gym
 * @param {string} gymId - The gym this QR belongs to
 * @param {string} purpose - e.g., CHECKIN
 * @param {object} metadata - Optional metadata
 */
function createQrToken({ gymId, purpose = "CHECKIN", metadata = {} }) {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      sub: gymId, // user/gym identifier
      gymId: gymId, // add gymId explicitly
      type: purpose,
      jti,
      metadata,
    },
    SECRET,
    { expiresIn: QR_EXP_SECONDS + "s" }
  );
  return { token, jti };
}

/**
 * Verifies a QR token and returns the decoded payload
 */
function verifyQrToken(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Signs a user JWT
 */
function signUserToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/**
 * Verifies a user JWT
 */
function verifyUserToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  createQrToken,
  verifyQrToken,
  signUserToken,
  verifyUserToken,
};
