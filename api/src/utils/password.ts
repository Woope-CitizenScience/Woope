const bcrypt = require('bcryptjs');
const saltRounds = 10;

/**
 * Hashes a password using bcrypt.
 *
 * @param password - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plaintext password with a hashed password.
 *
 * @param password - The plaintext password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 */

export const comparePasswords = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePasswords };