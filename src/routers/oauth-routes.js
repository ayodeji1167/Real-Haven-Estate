const { Router } = require('express');
const GoogleOauthController = require('../controllers/oauth-handler');

const router = Router();
router.get('/oauth/google', GoogleOauthController.handleOauth);

module.exports = router;
