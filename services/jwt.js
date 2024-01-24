const jwt = require("jsonwebtoken");
const log = require("../logger/index")
const {
    error
} = require("../src/response");

const JWT_SECRET = process.env.JWT_SECRET || "ajfgjaxhbw7t874*&*$Y!&gbcjs"
const EXPIRY_IN_MIN = process.env.ACCESS_TOKEN_EXPIRY_IN_MINUTES || 60;
const options = {
    expiresIn: EXPIRY_IN_MIN * 60
}

function createToken(payload){
    try {
        const token = jwt.sign(payload, JWT_SECRET, options)
        return token;
    } catch (error) {
        log.error(error);
        return null;
    }
}

function decodeToken({
    token,
}){
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; 
    } catch (error) {
        log.error(error);
        return null;
    }
}

function jwtVerify(req, res, next){
    if (req.user && req.user._id) next();
    else {
        return error(res, {
            status: 401,
            message: "Unauthorized"
        })
    }
}

module.exports = {
    createToken,
    decodeToken,
    jwtVerify
}