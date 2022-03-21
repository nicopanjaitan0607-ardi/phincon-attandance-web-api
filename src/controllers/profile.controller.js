const createError = require('http-errors')
const { userModel } = require('../models/user.model')
const { userChangePasswordValidation, userChangeProfileValidation } = require('../helpers/validation.schema')

exports.getUserLocation = async (req, res, next) => {
  try {
    const result = await userModel.findById(req.payload.aud)
    if (result.location.length === 0) throw createError(400, 'Location not found')

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Ok',
        result: result.location
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.getUserProfile = async (req, res, next) => {
  try {
    const result = await userModel.findById(req.payload.aud)

    // Send Response Success
    res.send({
      success: {
        status: 200,
        message: 'Ok',
        result
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.updateUserProfile = async (req, res, next) => {
  try {
    const valid = await userChangeProfileValidation.validateAsync(req.body)
    const result = await userModel.findById(req.payload.aud)

    if (req.body.fullname)
      result.fullname = req.body.fullname

    if (req.body.idcardnumber)
      result.idcardnumber = req.body.idcardnumber

    if (req.body.address)
      result.address = req.body.address

    result.save()

    // Send Response Success
    res.send({
      success: {
        status: 200,
        message: 'User has been changed successfully'
      }
    })
    } catch (error) {
      if (error.isJoi === true)
        error = createError(422, error.message)

      next(error)
    }
}

exports.updateUserPassword = async (req, res, next) => {
  try {
    const result = await userChangePasswordValidation.validateAsync(req.body)

    const resultUser = await userModel.findById(req.payload.aud)

    const passwordMatch = await resultUser.verifyPassword(result.password)
    if(!passwordMatch) throw createError(400, 'password is not correct')
  
    const password = resultUser.hashedPassword(result.new_password)
    await userModel.findByIdAndUpdate(resultUser.id, {
      password: password
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
