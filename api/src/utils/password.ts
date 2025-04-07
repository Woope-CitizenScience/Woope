const bcrypt = require('bcryptjs');
const saltRounds = 10;

export const hashPassword = async (password:string) => {
    return await bcrypt.hash(password, saltRounds);
}

export const comparePasswords = async (password:string, hashedPassword:string) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePasswords };