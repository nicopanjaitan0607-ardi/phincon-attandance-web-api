const createError = require('http-errors')
const fs = require('fs')
const fileHelper = require('../helpers/file.helper')
const { onBoardingModel } = require('../models/onboarding.model')
const { onBoardingValidation } = require('../helpers/validation.schema')

exports.getOnBoarding = async (req, res, next) => {
  try {
    const result = await onBoardingModel.find()
    if (!result.length) throw createError(404, 'Data not found')

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

exports.setOnBoarding = async (req, res, next) => {
  try {
    // Validation
    const result = await onBoardingValidation.validateAsync(req.body)
    if (!req.file) throw createError(422, 'File image is required')

    const count = await onBoardingModel.count()
    if (count === 3 || count > 3) throw createError(400, 'Data has exceeded capacity')

    const results = await onBoardingModel.create({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description
    })

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Data has been created successfully',
        results
      }
    })
  } catch (error) {
    // Cancel Upload File
    if (error && req.file) {
      if (fs.existsSync(process.env.PATH_IMAGE_ON_BOARDING + req.file.filename)) {
        fs.unlinkSync(process.env.PATH_IMAGE_ON_BOARDING + req.file.filename)
      }
    }
    next(error)
  }
}

exports.updateOnBoarding = async (req, res, next) => {
  try {
    await onBoardingValidation.validateAsync(req.body)
    if (!req.file) throw createError(422, 'File image is required')

    const result = await onBoardingModel.findById(req.params.id)
    if (!result) throw createError(404, 'Data not found')

    const recentImage = result.image
    result.image = req.file.filename
    result.title = req.body.title
    result.description = req.body.description

    if (fs.existsSync(process.env.PATH_IMAGE_ON_BOARDING + recentImage)) {
      fs.unlinkSync(process.env.PATH_IMAGE_ON_BOARDING + recentImage)
      result.save()
    }

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Data has been updated successfully'
      }
    })
  } catch (error) {
    // Cancel Upload File
    if (error && req.file) {
      if (fs.existsSync(process.env.PATH_IMAGE_ON_BOARDING + req.file.filename)) {
        fs.unlinkSync(process.env.PATH_IMAGE_ON_BOARDING + req.file.filename)
      }
    }
    next(error)
  }
}
