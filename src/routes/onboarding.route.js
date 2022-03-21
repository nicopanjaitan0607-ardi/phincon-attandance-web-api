const express = require('express')
const router = express.Router()
const fileHelper = require('../helpers/file.helper')
const onBoardingController = require('../controllers/onboarding.controller')

// Read On Boarding
router.get(
  '/onboarding',
  onBoardingController.getOnBoarding
)

// Create On Boarding
router.post(
  '/onboarding',
  fileHelper.fileOnBoarding,
  onBoardingController.setOnBoarding
)

// Update On Boarding
router.put(
  '/onboarding/:id',
  fileHelper.fileOnBoarding,
  onBoardingController.updateOnBoarding
)

module.exports = router
