function operationComplete({
    status = 200,
    message = "Valid",
    data = {}
}){
    return {
        status,
        message,
        type: "SUCCESS",
        data
    }
}

function operationIncomplete({
    status = 500,
    message = "Internal server error occured"
}){
    return {
        status,
        message,
        type: "ERROR"
    }
}

module.exports = {
    operationComplete,
    operationIncomplete
}