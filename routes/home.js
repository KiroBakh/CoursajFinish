const express = require('express')
const controller = require('../controllers/home')

const router = express.Router()

router.get('/', controller.getHome)



module.exports = router

