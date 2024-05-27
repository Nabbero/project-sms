/*
 * @author : Rajasekar
 * @version : 1.0.0
 * @name : project-sms
 * @description : Handling all the Web API's regarding project-SMS
 * 
 * App.js is the main entry point for the server.
 * Initializing all the required lib's and file's.
 */
require('dotenv').config();
const express = require('express');
const app = express();
const clientRoute = require('./routes/client.route');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const mongoose =  require('mongoose');
const {globalErrorHandler, Exception, asyncHandler} = require('./middlewares/errorHandler');

const api_v1 = '/api/v1';

/*
 *  Middlewares
 */
app.use(express.json());

/*
 * All V1 API routes's.
 */
app.use(`${api_v1}/token`,authRoute);
app.use(`${api_v1}/clients`,clientRoute);
app.use(`${api_v1}/users`,userRoute);

/* 
 * Handles all the unknown routes on the server.
 * Set status code set as 404, message and fault code by using custom Exception class.
 * Send it to the global error handler.
 */
app.all('*',(request,response, next) => {
    next(new Exception("ROUTE_NOT_FOUND"));
});

/*
 * Global Error Handler.
 * Handles all the exception from the server.
 * Send API response to users.
 */
app.use(globalErrorHandler);

/*
 * Connection process of the server.
 * Handles connection between DB and the Server.
 */
function connection() {
    mongoose.connect(process.env.DB_CONNECTION_URL).then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        });
    }).catch(err => {
        console.error(err);
    });
}

connection();