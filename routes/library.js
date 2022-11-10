const express = require('express')
const router = express.Router()
const libraryController = require('../controllers/library') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, libraryController.getLibrary)

module.exports = router