const multer = require('multer')
const createError = require('http-errors')

exports.fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true)
  } else {
    callback(null, false)
    return callback(createError(442, 'Only .png, .jpg and .jpeg format allowed!'))
  }
}

exports.fileStorageSplashScreen = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, process.env.PATH_IMAGE_SPLASH_SCREEN)
  },
  filename: (req, file, callback) => {
    let extArray = file.mimetype.split('/')
    let extension = extArray[extArray.length - 1]
    callback(null, new Date().getTime() + '.' + extension)
  }
})

exports.fileSplashScreen = multer({
  storage: this.fileStorageSplashScreen,
  fileFilter: this.fileFilter
}).single('image')

exports.fileStorageOnBoarding = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, process.env.PATH_IMAGE_ON_BOARDING)
  },
  filename: (req, file, callback) => {
    let extArray = file.mimetype.split('/')
    let extension = extArray[extArray.length - 1]
    callback(null, new Date().getTime() + '.' + extension)
  }
})

exports.fileOnBoarding = multer({
  storage: this.fileStorageOnBoarding,
  fileFilter: this.fileFilter
}).single('image')
