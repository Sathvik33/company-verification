const admin = require("firebase-admin");
const path = require("path");

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.join(__dirname, "serviceAccountKey.json"))
    ),
  });
}

module.exports = admin;