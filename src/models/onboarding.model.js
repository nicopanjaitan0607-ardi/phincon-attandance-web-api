const mongoose = require('mongoose')
const Schema = mongoose.Schema

const onBoardingSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

exports.onBoardingModel = mongoose.model('OnBoarding', onBoardingSchema)
