const { validationResult } = require('express-validator');

function success(res, obj) {
    const { message, status, data } = obj;
    res.status(status).json({ status: status, success: true, response: data, message });
}

function error(res, obj) {
    const { status, message } = obj;
    res.status(status).json({ status: status, success: false, message });
}

function checkError(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return error(res, { status: 422, message: errors.array()[0].msg || 'invalid parameters' });
    }
    next();
}

function sendResponse(res, obj){
    if (obj.type === "SUCCESS"){
        success(res, obj);
    } else if (obj.type === "ERROR"){
        success(res, obj);
    }
}

module.exports = {
    success,
    error,
    checkError,
    sendResponse
}