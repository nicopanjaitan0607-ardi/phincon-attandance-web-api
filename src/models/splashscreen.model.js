const mongoose = require('mongoose')
const Schema = mongoose.Schema

const splashScreenSchema = new Schema(
    {
      image: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
  
exports.splashScreenModel = mongoose.model('SplashScreen', splashScreenSchema)
