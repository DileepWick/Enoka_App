import express from 'express';
import {
    addEmailToWhitelist,
    getWhitelistedEmails,
    removeEmailFromWhitelist,
    isEmailWhitelisted,
} from '../controllers/wluserController.js';

const router = express.Router();

// Add an email to whitelist
router.post('/:id', addEmailToWhitelist);

// Get all whitelisted emails
router.get('/', getWhitelistedEmails);

// Remove an email from whitelist
router.delete('/:id', removeEmailFromWhitelist);

// Check if an email is whitelisted
router.post('/:id', isEmailWhitelisted);

export default router;
