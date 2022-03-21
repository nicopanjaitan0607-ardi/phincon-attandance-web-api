const createError = require('http-errors')
const { userModel } = require('../models/user.model')
const { userRegistrationValidation, userAuthenticationValidation, forgotPasswordValidation } = require('../helpers/validation.schema')
const { signAccessToken } = require('../helpers/jwt.helper')

exports.userRegistration = async (req, res, next) => {
  try {
    const valid = await userRegistrationValidation.validateAsync(req.body)

    valid.location = [{
      name: process.env.DEFAULT_USER_LOCATION_NAME,
      address: process.env.DEFAULT_USER_LOCATION_ADDRESS,
      latitude: process.env.DEFAULT_USER_LOCATION_LATITUDE,
      longitude: process.env.DEFAULT_USER_LOCATION_LONGTITUDE,
      image: process.env.DEFAULT_USER_LOCATION_IMAGE
    }]

    const result = await userModel.create(valid)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'User has been registered successfully'
      }
    })
  } catch (error) {
    if (error.isJoi === true)
      error = createError(422, error.message)

    if (error.code === 11000 && error.keyPattern.username === 1)
      error = createError(400, `username ${error.keyValue.username} is already registered`)

    if (error.code === 11000 && error.keyPattern.idcardnumber === 1)
      error = createError(400, `idcardnumber ${error.keyValue.idcardnumber} is already registered`)

    next(error)
  }
}

exports.userAuthentication = async (req, res, next) => {
  try {
    const valid = await userAuthenticationValidation.validateAsync(req.body)
    const result = await userModel.findOne({ username: valid.username })
    if(!result) throw createError(404, 'User not found')

    const passwordMatch = await result.verifyPassword(valid.password)
    if(!passwordMatch) throw createError(400, 'Password not correct')

    const accessToken = await signAccessToken(result.id)

    res.send({
      success: {
        status: 200,
        message: 'User has been logged successfully',
        token: accessToken
      }
    })
  } catch (error) {
    if (error.isJoi === true)
      error = createError(422, error.message)

    next(error)
  }
}

exports.userForgotPassword = async (req, res, next) => {
  try {
    const valid = await forgotPasswordValidation.validateAsync(req.body)

    const result = await userModel.findOne({ idcardnumber: valid.idcardnumber })
    if(!result) throw createError(404, 'User not found')

    const newPassword = result.hashedPassword(valid.password)
    await userModel.findOneAndUpdate({ _id: result._id }, {
      password: newPassword
    })

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Password has been changed successfully'
      }
    })
    } catch (error) {
      if (error.isJoi === true)
        error = createError(422, error.message)

      next(error)
    }
}
