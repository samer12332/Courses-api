const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (payload) => {
    const token = await jwt.sign(payload, 
        process.env.JWT_SECRET_KEY, {expiresIn: '1m'});
    return token
}