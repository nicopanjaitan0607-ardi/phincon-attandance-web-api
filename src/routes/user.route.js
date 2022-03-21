const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwt.helper')
const userController = require('../controllers/user.controller')
const profileController = require('../controllers/profile.controller')

// User Registration
router.post(
  '/registration',
  userController.userRegistration
)

// User Authentication
router.post(
  '/authentication',
  userController.userAuthentication
)

// User Forgot Password
router.post(
  '/forgot-password',
  userController.userForgotPassword
)

// Get User Location
router.get(
  '/user-location',
  verifyAccessToken,
  profileController.getUserLocation
)

// Get User Profile
router.get(
  '/user-profile',
  verifyAccessToken,
  profileController.getUserProfile
)

// Change User Password
router.put(
  '/user-change-password',
  verifyAccessToken,
  profileController.updateUserPassword
)

// Change User Profile
router.put(
  '/user-change-profile',
  verifyAccessToken,
  profileController.updateUserProfile
)

module.exports = router
