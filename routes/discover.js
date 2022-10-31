const express = require('express')
const router = express.Router()
const discoverController = require('../controllers/discover') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, discoverController.getDiscover)

router.post('/createBook', discoverController.createBook)

module.exports = router