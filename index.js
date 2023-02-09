const { google } = require("googleapis");
const express = require("express");
const oauth2Client = require("./client");
const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");

const app = express();

// Set client globally for Google APIs
google.options({ auth: oauth2Client });

app.use("/", authRoutes);
app.use("/", contactsRoutes);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
