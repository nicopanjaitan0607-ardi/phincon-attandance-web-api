const express = require('express')
const router = express.Router()
const fileHelper = require('../helpers/file.helper')
const splashScreenController = require('../controllers/splashscreen.controller')

// Read Splash Screen
router.get(
  '/splashscreen',
  splashScreenController.getSplashScreen
)

// Create or Update Splash Screen
router.put(
  '/splashscreen',
  fileHelper.fileSplashScreen,
  splashScreenController.setSplashScreen
)

module.exports = router
