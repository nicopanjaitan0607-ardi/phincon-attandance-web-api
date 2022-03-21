const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
require('dotenv').config()

const userSchema = new Schema({
  username: {
    type: String, 
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  idcardnumber: {
    type: Number,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: process.env.DEFAULT_USER_IMAGE,
  },
  location: [{
    name: String,
    address: String,
    latitude: String,
    longitude: String,
    image: String
  }],
  createdAt: Number,
  updatedAt: Number,
},
{
  timestamps: true,
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})

userSchema.pre('save', function (next) {
  try {
    this.password = this.hashedPassword(this.password)
    next()
  } catch (error) {
    error = createError.BadRequest()
    next(error)
  }
})

userSchema.methods.verifyPassword = function (password) {
  try {
    return bcrypt.compareSync(password, this.password)
  } catch (error) {
    throw error
  }
}

userSchema.methods.hashedPassword = function (password) {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  return hashedPassword
}

exports.userModel = mongoose.model('User', userSchema)
