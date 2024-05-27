const { Exception, asyncHandler } = require('../middlewares/errorHandler');
const { Client } = require('../models/client.model');
const bcrypt = require('bcrypt');

/*
 * Get all the Clients
 * This method is used to return all the client details.
 * Fetch and send all the data from our DB.
 */
exports.getClients = asyncHandler( async(request,response) => {
    // Read all the client's in the DB.
    // It returns zero if not found.
    const clients = await Client.find();
    response.status(200).json({
        status : 'success',
        count : clients.length,
        data : clients
    });
});

/*
 * Get the Client by ID
 * This method is used to return the specific client.
 * Fetch and send all the data about the client from our DB.
 */
exports.getClientByID = asyncHandler( async(request,response,next) => {

    // FInd the client by ID in the DB.
    // It returns null if not found.
    const client = await Client.findById(request.params.id);
    
    // Check's if the client is found or not.
    // If not found then throwing an exception.
    if(!client) {
        return next(new Exception("CLIENT_NOT_FOUND"));
    }

    response.status(200).json({
        status : 'success',
        count : client.length,
        data : client
    });
   
});


/*
 * Register Client
 * This method is used to register a new client.
 * Store the data into our DB.
 */
exports.registerClient = asyncHandler( async(request,response,next) => {

    // Input validation.
    // Pre-Checks Password field only because we need to encrypt it before saves it into our DB
    if(!request.body.adminPassword) {
        return next(new Exception("MANDATORY_FIELDS_ARE_MISSING"));
    }
    // Converting plain password to encrypted format.
    request.body.adminPassword = await bcrypt.hash(request.body.adminPassword, parseInt(process.env.SALT_ROUNDS));

    // Creates a client in our DB in the "clients" collection. 
    const client = await Client.create(request.body);

    response.status(201).json({
        status : 'success',
        data : client
    });
});


/*
 * Delete all the Clients
 * Remove all the data of the clients from our DB.
 */
exports.deleteClients = asyncHandler( async(request,response,next) => {

    const client = await Client.deleteMany();

    response.status(200).json({
        status : 'success',
        acknowledged : client.acknowledged,
        deletedCount : client.deletedCount
    });
   
});

/*
 * Delete the client by ID
 * Remove all the data of the client from our DB.
 */
exports.deleteClientByID = asyncHandler( async(request,response,next) => {

    await Client.findByIdAndDelete(request.params.id);

    response.status(200).json({
        status : 'success',
        _id : request.params.id,
        acknowledged : true,
    });
   
});

/*
 * Update the client by ID
 */
exports.updateClientByID = asyncHandler( async(request,response,next) => {

    const client = await Client.findByIdAndUpdate(request.params.id, request.body, {
        new : true
    });

    response.status(200).json({
        status : 'success',
        data : client
    });
   
});