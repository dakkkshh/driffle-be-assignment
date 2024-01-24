const { Router } = require("express");
const { body } = require("express-validator");

const {
    createUser,
    getUserById,
    loginUser,
    logoutUser
} = require("../controllers/user.controller");

const {
    sendResponse,
    checkError
} = require("../response");

const {
    jwtVerify
} = require("../../services/jwt");

const userRouter = Router();

userRouter
    .route("/")
    .get(
        jwtVerify,
        async (req, res) => {
            const id = req.user?._id;
            const user = await getUserById(id);
            return sendResponse(res, user);
        }
    );

userRouter
    .route("/register")
    .post(
        [
            body("email")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Email is required")
                .trim()
                .isEmail()
                .withMessage("Invalid email"),
            body("name")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Name is required")
                .trim()
                .isString()
                .withMessage("Name must be a string"),
            body("password")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Password is required")
                .isString()
                .withMessage("Password must be a string")
                .isLength({ min: 8 })
                .withMessage("Password must be atleast 8 characters long")
        ],
        checkError,
        async (req, res) => {
            const {
                name,
                email,
                password
            } = req.body;
            const user = await createUser({
                name,
                email,
                password
            });
            return sendResponse(res, user);
        }
    );

userRouter
    .route("/login")
    .post(
        [
            body("email")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Email is required")
                .trim()
                .isEmail()
                .withMessage("Invalid email"),
            body("password")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Password is required")
                .isString()
                .withMessage("Password must be a string")
                .isLength({ min: 8 })
                .withMessage("Password must be atleast 8 characters long")
        ],
        checkError,
        async (req, res) => {
            const {
                email,
                password
            } = req.body;
            const user = await loginUser({
                email,
                password,
                res
            });
            return sendResponse(res, user);
        }
    );

userRouter
    .route("/logout")
    .post(
        jwtVerify,
        async (req, res) => {
            const user = await logoutUser({
                res: res
            });
            return sendResponse(res, user);
        }
    );


module.exports = {
    userRouter
}