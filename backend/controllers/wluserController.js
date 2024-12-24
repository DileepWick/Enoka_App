import WhitelistEmail from '../models/WLuser.js';

// Add email to whitelist
export const addEmailToWhitelist = async (req, res) => {
    const { email } = req.body;

    try {
        const existingEmail = await WhitelistEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already whitelisted.' });
        }

        const newEmail = new WhitelistEmail({ email });
        await newEmail.save();

        res.status(201).json({ message: 'Email added to whitelist successfully.', email: newEmail });
    } catch (error) {
        console.error('Error adding email to whitelist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all whitelisted emails
export const getWhitelistedEmails = async (req, res) => {
    try {
        const emails = await WhitelistEmail.find();
        res.status(200).json(emails);
    } catch (error) {
        console.error('Error fetching whitelisted emails:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Remove email from whitelist
export const removeEmailFromWhitelist = async (req, res) => {
    const { email } = req.body;

    try {
        const deletedEmail = await WhitelistEmail.findOneAndDelete({ email });

        if (!deletedEmail) {
            return res.status(404).json({ message: 'Email not found in whitelist.' });
        }

        res.status(200).json({ message: 'Email removed from whitelist successfully.', email: deletedEmail });
    } catch (error) {
        console.error('Error removing email from whitelist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Check if email is whitelisted
export const isEmailWhitelisted = async (req, res) => {
    const { email } = req.body;

    try {
        const emailExists = await WhitelistEmail.findOne({ email });

        if (!emailExists) {
            return res.status(404).json({ message: 'Email is not whitelisted.' });
        }

        res.status(200).json({ message: 'Email is whitelisted.', email: emailExists });
    } catch (error) {
        console.error('Error checking if email is whitelisted:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
