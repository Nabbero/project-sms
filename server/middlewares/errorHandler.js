const errorConfig = require('../configs/error.config.json');

/*
 * Custom Exception class which is used to create a custom error object.
 * The Error's which are created by this class are operational error's.
 */
class Exception extends Error {
    constructor(exceptionCode) {
        super(errorConfig[exceptionCode].message);
        this.status = errorConfig[exceptionCode].statusCode;
        this.faultCode = errorConfig[exceptionCode].faultCode;
        this.isOperational = true;
    }
}

function checksException(error) {
    if (error.code === 11000) {
        return new Exception("DUPLICATE_KEY_FOUND")
    }
    return error;
}

/*
 * Defined Global error handler function process.
 * Based on the server environment it displays the error response.
 */
function globalErrorHandler(error, request, response, next) {

    error = checksException(error);

    if (process.env.ENV.toLowerCase() === "development") {
        displayDevError(response, error);
    } else if (process.env.ENV.toLowerCase() === "production") {
        displayProdError(response, error);
    }
}

/*
 * Async error handler.
 * Which is used to handle the error's of async functions.
 * If there is any error occur in the promise
 * then catch and send it to the global error handler.
 */
function asyncHandler(func) {
    return (request, response, next) => {
        func(request, response, next).catch(err => next(err)
        );
    };
}

/*
 * Display the full error in the development env.
 */
function displayDevError(response,error) {
    console.log("Inside the Dev Error Display")
    console.log(error);
    response.status(error.status || errorConfig.UNKNOWN_ERROR.statusCode).json({
        faultCode : error.faultCode || errorConfig.UNKNOWN_ERROR.faultCode,
        message : error.message,
        error : error

    });
}

/*
 * Display the specific error's in the production env.
 * If the error is not an operational error then
 * send a generic error to the users.
 */
function displayProdError(response,error) {

    /*
     * Checks for the operational flag value.
     * If the error is created by the Exception class then 
     * this if block will execute.
     */
    if(error.isOperational) {
        response.status(error.status).json({
            faultCode : error.faultCode,
            message : error.message
        });
    } 
    /*
     * Other error which is not created by the exception class.
     * Send's the generic error to the user's
     */
    else {
        response.status(errorConfig.UNKNOWN_ERROR.statusCode).json({
            faultCode : errorConfig.UNKNOWN_ERROR.faultCode,
            message : errorConfig.UNKNOWN_ERROR.message
        });
    }
}

/*
 * Exports the neccessary modules to other files..
 */
module.exports = {
    Exception, 
    globalErrorHandler, 
    asyncHandler
};