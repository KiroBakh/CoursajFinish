const express = require("express");
const controller = require("../controllers/profile");
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')

router.get('', isLoggedIn, controller.getProfile)



router.get('/changePassword', controller.getChangePassword)
router.post('/changePassword', controller.changePassword)

module.exports = router;