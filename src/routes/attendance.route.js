const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwt.helper')
const attendanceController = require('../controllers/attendance.controller')

// Attendance Check In
router.post(
  '/check-in',
  verifyAccessToken,
  attendanceController.createCheckIn
)

// Attendance Check Out
router.post(
  '/check-out',
  verifyAccessToken,
  attendanceController.createCheckOut
)

// Attendance Get History
router.get(
  '/history',
  verifyAccessToken,
  attendanceController.getHistory
)

// Test Function
// router.post(
//   '/test',
//   verifyAccessToken,
//   dashboardController.test
// )

module.exports = router
