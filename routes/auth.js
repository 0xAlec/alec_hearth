const express = require("express");
const router = express.Router();
const oauth2Client = require("../client");

/**
 * Function that generates a Google OAuth2 URL for authorization.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @returns {void}
 */
const authorize = (req, res) => {
  const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: SCOPES,
  });
  res.redirect(301, authorizationUrl);
};

/**
 * Callback function for handling the result of the OAuth2 authorization process.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @returns {void}
 */
const callback = async (req, res) => {
  if (req.url.startsWith("/oauth2/redirect")) {
    if (req.query.error) {
      res.send("Error with generated url: ", req.url);
    }
    const code = req.query["code"];
    let { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
  }
  res.redirect("/list");
};

router.get("/login", authorize);
router.get("/oauth2/redirect", callback);

module.exports = router;
