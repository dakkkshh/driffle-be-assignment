const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//Utils
const {
    error
} = require("./response");
const log = require("../logger/index");
const {
    decodeToken
} = require("../services/jwt");

//Controllers
const {
    getUserById
} = require('./controllers/user.controller');
const { operationIncomplete } = require("./consts");

//Routers
const {
    userRouter
} = require("./routes/user.routes");
const {
    noteRouter
} = require("./routes/note.routes");


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    log.info("Connected to MongoDB");
}).catch((error) => {
    log.error(error);
});

mongoose.connection.on('error', (error) => {
    log.error(error);
});

mongoose.connection.on('disconnected', () => {
    log.info("Disconnected from MongoDB");
});

mongoose.connection.on('reconnect', () => {
    log.info("Reconnected to MongoDB");
});

const cehck = operationIncomplete({});

app.use(async (req, res, next) => {
    log.info(`${req.method} ${req.url}`);
    try {
        const token = req.cookies["driffle-token"];
        if (token){
            const decoded = decodeToken({token});
            if (decoded){
                const user = await getUserById(decoded.id);
                if (user){
                    req.user = user.data;
                } else {
                    res.clearCookie("driffle-token");
                }
            } else {
                res.clearCookie("driffle-token");
            }
        }
        next();
    } catch (err) {
        log.error(err);
        return error(res, {
            status: 500,
            message: "Internal Server Error"
        })
    }
});

app.get("/", (req, res) => {
    res.send(`Hey, the server is up and running!. For more details, go to <a href="https://github.com/dakkkshh/driffle-be-assignment" target="_blank">Driffle BE Assignment - dakkkshh</a>`)
})
app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);
app.use((req, res) => {
    error(res, { status: 404, message: "Route not found" });
});

module.exports = app;