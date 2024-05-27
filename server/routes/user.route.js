const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, permission} = require('../controllers/auth.controller');


/**
 * Used to Register a new client.
 * Restricted to all other users except Master admin.
 */
router.route('/register')
        .post(verifyToken, permission('admin'), userController.registerUsers);

module.exports = router;