import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { isEmailWhitelisted } from '../controllers/wluserController.js'; // Assuming this function exists and checks the whitelist

// Read and parse the service account key file
const serviceAccount = JSON.parse(readFileSync('./firebase/firebaseadmin.json', 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use the service account
});

// Middleware to validate Firebase token and check if email is whitelisted
const validateAndVerifyWhitelist = async (req, res, next) => {
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

    req.user = decodedToken; // Attach the decoded token (user data) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying Firebase token or checking whitelist:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token or whitelist check failed' });
  }
};

export default validateAndVerifyWhitelist;
