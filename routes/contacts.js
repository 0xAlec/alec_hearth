const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const oauth2Client = require("../client");
const {
  retrieveThreads,
  retrieveUniqueParticipants,
  getUserEmail,
  parseThreadParticipants,
} = require("../utils/utils");

/**
 * Function that retrieves the contacts associated with an email from the Google People API.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @returns {void}
 */
const list = async (req, res) => {
  // Hacky, in production we would use authentication middleware
  if (Object.keys(oauth2Client.credentials).length == 0) {
    res.status(401).send("Unauthenticated, please login.");
    return;
  }
  const service = google.gmail({ version: "v1" });
  const emails = await service.users.threads.list({
    userId: "me",
    maxResults: 500,
    q: "is:sent",
  });
  if (emails.status != 200) {
    res.send("Error retrieving emails: ", emails.statusText);
  }
  const threads = await retrieveThreads(service, emails.data.threads);
  const userEmail = await getUserEmail(service);
  let contacts = [];
  try {
    const threadParticipants = parseThreadParticipants(threads);
    contacts = retrieveUniqueParticipants(userEmail, threadParticipants);
  } catch (error) {
    console.error(error);
  }
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(contacts, null, 4));
};

router.get("/list", list);

module.exports = router;
