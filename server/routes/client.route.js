const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { verifyToken, permission} = require('../controllers/auth.controller');

/**
 * Overall Read and Delete the client details.
 * Restricted to all other users except Master admin.
 */
router.route('/')
        .get(verifyToken,permission('master'), clientController.getClients)
        .delete(verifyToken, permission('master'), clientController.deleteClients);

/**
 * Read and Delete the client details by ID.
 * GET : Client can able to read the data.
 * DELETE : Restricted to all other users except Master admin.
 */
router.route('/:id')
        .get(verifyToken, permission('admin','master'), clientController.getClientByID)
        .patch(verifyToken, permission('master'), clientController.updateClientByID)
        .delete(verifyToken, permission('master'), clientController.deleteClientByID);

/**
 * Used to Register a new client.
 * Restricted to all other users except Master admin.
 */
router.route('/register')
        .post(verifyToken, permission('master'), clientController.registerClient);

module.exports = router;