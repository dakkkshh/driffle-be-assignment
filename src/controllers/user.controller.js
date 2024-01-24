const {
    user
} = require("../models/user.model");
const bcrypt = require("bcryptjs");
const log = require("../../logger/index")
const {
    operationComplete,
    operationIncomplete
} = require("../consts");
const {
    createToken
} = require("../../services/jwt");

const EXPIRY_IN_MIN = process.env.ACCESS_TOKEN_EXPIRY_IN_MINUTES || 60;

async function createUser({
    name,
    email,
    password      
}){
    try {
        if (!name || !email || !password){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for user creation"
            })
        }
        const check = await user.findOne({
            email
        });
        if (check){
            return operationIncomplete({
                status: 409,
                message: "User with this email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = await user.create({
            name,
            email,
            password: hashedPassword
        });

        return operationComplete({
            status: 201,
            message: "User created",
            data: User
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function getUserById(id){
    try {
        if (!id){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for user search"
            });
        }
        const User = await user.findById(id);
        if (!User){
            return operationIncomplete({
                status: 404,
                message: "User not found"
            });
        }
        return operationComplete({
            status: 200,
            message: "User found",
            data: User
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function loginUser({
    email,
    password,
    res
}){
    try {
        if (!email || !password){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for user login"
            });
        }
        const User = await user.findOne({
            email
        });
        if (!User){
            return operationIncomplete({
                status: 404,
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch){
            return operationIncomplete({
                status: 401,
                message: "Invalid credentials"
            });
        }

        const token = createToken({
            id: User._id,
            email: User.email
        });

        if (!token){
            return operationIncomplete({});
        }

        res.cookie("driffle-token", token, {
            httpOnly: true,
            maxAge: EXPIRY_IN_MIN * 60 * 1000,
        });

        return operationComplete({
            status: 200,
            message: "User logged in",
            data: User
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function logoutUser({
    res
}){
    try {
        res.clearCookie("driffle-token");
        return operationComplete({
            status: 200,
            message: "User logged out"
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

module.exports = {
    createUser,
    getUserById,
    loginUser,
    logoutUser
}

