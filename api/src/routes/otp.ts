import crypto from 'crypto';

import express from 'express';
import { sendOtpEmail, verifyOtp, storeOTP } from '../models/otp';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        await storeOTP(email, otp);
        await sendOtpEmail(email, otp);
        console.log(`📤 Sent OTP ${otp} to ${email}`);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const isValid = await verifyOtp(email, otp);
        if (isValid) {
            res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.status(401).json({ success: false, error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Failed to verify OTP' });
    }
});

export default router;