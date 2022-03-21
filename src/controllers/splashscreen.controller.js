const createError = require('http-errors')
const fs = require('fs')
const { splashScreenModel } = require('../models/splashscreen.model')

exports.getSplashScreen = async (req, res, next) => {
  try {
    const result = await splashScreenModel.findOne()
    if (!result) throw createError(404, 'Data not found')

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Ok',
        result: {
          image: {
            name: result.image,
            path: req.protocol + '://' + req.get('host') + '/images/splashscreen/' + result.image
          }
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.setSplashScreen = async (req, res, next) => {
  try {
    if (!req.file) throw createError(422, 'File image is required')

    let data = []
    const result = await splashScreenModel.findOne()
    if (result) {
      const imagePath = process.env.PATH_IMAGE_SPLASH_SCREEN + result.image
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
      data = await splashScreenModel.update({ image: req.file.filename })
    } else {
      data = await splashScreenModel.create({ image: req.file.filename })
    }

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Image has been updated successfully'
      }
    })
  } catch (error) {
    // Cancel Upload File
    if (error && req.file) {
      if (fs.existsSync(process.env.PATH_IMAGE_SPLASH_SCREEN + req.file.filename)) {
        fs.unlinkSync(process.env.PATH_IMAGE_SPLASH_SCREEN + req.file.filename)
      }
    }
    next(error)
  }
}
