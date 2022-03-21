const express = require('express')
const multer = require('multer')
const cors = require('cors')
const createError = require('http-errors')
const path = require('path')

require('dotenv').config()
require('./src/config/db.config')

const { verifyApiKey, verifyAccessToken } = require('./src/helpers/jwt.helper')

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT']
}))

// Public Static Handler
app.use('/images', express.static(path.join(__dirname, 'images')))

// Verification API Key
app.use('/', verifyApiKey)

const splashScreenRoute = require('./src/routes/splashscreen.route')
const onBoardingRoute = require('./src/routes/onboarding.route')
const userRoute = require('./src/routes/user.route')
const attendanceRoute = require('./src/routes/attendance.route')
// Route
app.use(splashScreenRoute)
app.use(onBoardingRoute)
app.use(userRoute)
app.use(attendanceRoute)
// app.use(authenticationRoute)
// app.use(dashboardRoute)

app.use((req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
