const { Exception, asyncHandler } = require('../middlewares/errorHandler');
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');

/*
 * Register user
 * This method is used to register a new user.
 * Store the data into our DB.
 */
exports.registerUsers = asyncHandler( async(request,response,next) => {

    const users = [];

    // Input validation and password encryption.
    const promises = request.body.map(async (userObject) => {
        if (!userObject.userPassword) {
            return next(new Exception("MANDATORY_FIELDS_ARE_MISSING"));
        }
        userObject.userPassword = await bcrypt.hash(userObject.userPassword, parseInt(process.env.SALT_ROUNDS));

        // Assigning Client ID
        // Getting Client ID from the JWT access token of the admin.
        userObject.clientID = request.body.payload.clientID;
        users.push(userObject);
    });

    // Wait for all password hashing to complete.
    await Promise.all(promises);

    // Creates a client in our DB in the "clients" collection. 
    await User.create(users);

    response.status(201).json({
        status: 'success',
        insertedCount: users.length
    });

});
 