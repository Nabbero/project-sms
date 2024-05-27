const jwt = require('jsonwebtoken');
const util = require('util');
const { Exception, asyncHandler } = require('../middlewares/errorHandler');
const { Client } = require('../models/client.model');
const bcrypt = require('bcrypt');

/*
 * Generate JWT token.
 */
function generateToken(body) {
    return jwt.sign(body, process.env.TOKEN_SECRET_KEY, {expiresIn : process.env.TOKEN_EXPIRES});
}
/*
 *  Construct JWT token with the user ID for the public (All the users).
 */
exports.sendPublicToken = (request,response) => {
    const token = generateToken({_id:request.body.id});
    
    response.status(201).json({
        status : 'success',
        expiresIn : `${(process.env.TOKEN_EXPIRES / 1000) / 60} min`,
        access_token : token
    });
}

/*
 * validate and create JWT access token's for the Admin's.
 * uses "client" collection in our DB where we stored Admin credentials. 
 */
exports.sendPrivateToken = asyncHandler( async (request,response, next) => {

    // Filter the Admin ID
    // If not found then it return an null value.
    const client = await Client.findOne({adminID : request.body.adminID});

    // Checks if the searched value is empty or not.
    if(!client) {
        return next(new Exception("ADMIN_NOT_FOUND"));
    }
   
    // Checks if the requested password and the password from DB are same or not.
    if(!await bcrypt.compare(request.body.adminPassword, client.adminPassword)) {
        return next(new Exception("ADMIN_INVALID_PASSWORD"));
    }

    // Generate the JWT Access token.
    const token = generateToken({
        name : client.name,
        clientID : client._id,
        db : 'clients'
    });
    
    response.status(201).json({
        status : 'success',
        expiresIn : `${(process.env.TOKEN_EXPIRES / 1000) / 60} min`,
        access_token : token
    });
});


exports.sendMasterToken = asyncHandler( async (request,response, next) => {

   
    // Checks if the requested password and the password from DB are same or not.
    if(!request.body.id === process.env.MASTER_ID || !request.body.key === process.env.MASTER_KEY) {
        return next(new Exception("ADMIN_INVALID_PASSWORD"));
    }

    // Generate the JWT Access token.
    const token = generateToken({
        name : 'master',
        db : 'clients'
    });
    
    response.status(201).json({
        status : 'success',
        expiresIn : `${(process.env.TOKEN_EXPIRES / 1000) / 60} min`,
        access_token : token
    });
});


/*
 * Verify the JWT tokens are valid or not.
 */
exports.verifyToken = asyncHandler(
    async (request,response, next) => {

        let token = request.headers.authorization;

        if(!token || !token.toLowerCase().startsWith('bearer')) {
            return next(new Exception("INVALID_ACCESS_TOKEN"));
        }
        token = token.split(' ')[1];
        
        const decodedToken = await util.promisify(jwt.verify)(token,process.env.TOKEN_SECRET_KEY);

        if(decodedToken.db === 'clients') {
            request.body.payload = (decodedToken.name === 'master') ? {role:'master'} : {role:'admin', clientID:decodedToken.clientID};
        } else {
            request.body.payload = {role:'user'};
        }
        
        next();
    }   
);

/*
 * Verify the user role and authorize the user depends on the role.
 */
exports.permission = (...role) => {
    return (request,response,next) => {
        const requestedRole = request.body.payload.role;
        if(!requestedRole)
            return next(new Exception("INVALID_USER_ROLE"));
        
        if(!role.includes(requestedRole))
            return next(new Exception("USER_FORBIDDEN"));
        
        next();
    }
}