const pool = require('../db');

export async function storeOTP(email: string, otp: string): Promise<void> {
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await pool.query(
        'INSERT INTO otp (email, otp, expires_at) VALUES ($1, $2, $3)',
        [email, otp, expires_at]
    );
    console.log(`🔐 Stored OTP for ${email} with expiry at ${expires_at}`);
}

export async function getOTPByEmail(email: string): Promise<{ otp: string; expires_at: Date } | null> {
    const result = await pool.query('SELECT otp, expires_at FROM otp WHERE email = $1', [email]);
    return result.rows[0] || null;
}

export async function deleteOTP(email: string): Promise<void> {
    await pool.query('DELETE FROM otp WHERE email = $1', [email]);
}

import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Woope OTP',
        text: `Your OTP for Woope Signup is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await getOTPByEmail(email);
    console.log("🔍 OTP Record:", record);
    if (!record) return false;

    const now = new Date();
    const isExpired = record.expires_at < now;
    const isMatch = record.otp === otp;

    console.log('OTP Verification:', {
        email,
        otp,
        storedOtp: record.otp,
        expiresAt: record.expires_at,
        now,
        isExpired,
        isMatch
    });

    if (!isExpired && isMatch) {
        //await deleteOTP(email);
        return true;
    }
    return false;
}