const express = require('express');
const router = express.Router();
const { sendPublicToken, sendPrivateToken, sendMasterToken } = require('../controllers/auth.controller');

router.route('/').post(sendPublicToken);
router.route('/admin').post(sendPrivateToken);
router.route('/master').post(sendMasterToken);

module.exports = router;