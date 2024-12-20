import express from 'express';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { isEmailWhitelisted } from '../controllers/wluserController.js'; // Assuming this function exists and checks the whitelist

// Read and parse the service account key file
const serviceAccount = JSON.parse(readFileSync('./firebase/firebaseadmin.json', 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use the service account
});

const router = express.Router();

// Middleware to validate Firebase token, check if email is whitelisted, and handle session expiration
export const validateAndVerifyWhitelist = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Extract email from decoded token
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'Invalid token: No email found' });
    }

    // Check if the email is whitelisted
    const isWhitelisted = await isEmailWhitelisted(userEmail);

    if (!isWhitelisted) {
      return res.status(403).json({ message: 'Forbidden: Email is not whitelisted' });
    }

    // Check if session is about to expire (within 5 minutes)
    const sessionExpiryTime = decodedToken.exp * 1000; // Expiration time in milliseconds
    const currentTime = Date.now();

    if (sessionExpiryTime - currentTime < 300000) { // 5 minutes before expiration
      // Session is about to expire, prompt user to extend session
      res.json({ promptExtendSession: true });
    } else {
      // Attach the decoded token (user data) to the request object
      req.user = decodedToken;
      next(); // Proceed to the next middleware or route handler
    }

  } catch (error) {
    console.error('Error verifying Firebase token or checking whitelist:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token or whitelist check failed' });
  }
};

// Route to handle session extension
router.post('/', validateAndVerifyWhitelist, async (req, res) => {
  try {
    const newToken = await admin.auth().createCustomToken(req.user.uid);
    res.json({ newToken });
  } catch (error) {
    console.error('Error extending session:', error);
    res.status(500).send(error.message);
  }
});

export default router;
