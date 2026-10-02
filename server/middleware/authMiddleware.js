const {
  initializeApp,
  cert,
  getApps,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

let firebaseApp;

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    );

    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    const path = require("path");

    const serviceAccount = require(
      path.join(__dirname, "..", "serviceAccountKey.json")
    );

    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  }
} else {
  firebaseApp = getApps()[0];
}

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: No authentication token provided",
      });
    }

    const idToken = authHeader.substring(7);

    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      idToken
    );

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = verifyToken;