const joi = require('joi')

// Welcome On Boarding | /routes/onboarding.route
exports.onBoardingValidation = joi.object().keys({
  title: joi.string()
    .required()
    .max(100),
  description: joi.string()
    .required()
    .max(250)
})

// Registration Validation | /routes/user.route
exports.userRegistrationValidation = joi.object().keys({
  username: joi.string()
    .required()
    .length(14),
  password: joi.string()
    .required()
    .min(6),
  fullname: joi.string()
    .required()
    .max(50),
  idcardnumber: joi.string()
    .required()
    .length(16),
  address: joi.string()
    .max(100),
  // location: joi.array().items(
  //   joi.object().keys({
  //     name: joi.string().max(50),
  //     address: joi.string().max(100),
  //     latitude: joi.string().max(18),
  //     longitude: joi.string().max(18),
  //     image: joi.string().max(50),
  //   })
  // )
})

// Authentication Validation | /routes/user.route
exports.userAuthenticationValidation = joi.object().keys({
  username: joi.string()
    .required()
    .length(14),
  password: joi.string()
    .required()
    .min(6),
})

// Forgot Password Validation | /routes/user.route
exports.forgotPasswordValidation = joi.object().keys({
  idcardnumber: joi.string()
    .required()
    .length(16),
  password: joi.string()
    .required()
    .min(6),
  confirm_password: joi.any()
    .required()
    .equal(joi.ref('password'))
    .messages({'any.only': '{{#label}} does not match'}),
})

// Change Password Validation | /routes/user.route
exports.userChangePasswordValidation = joi.object().keys({
  password: joi.string()
    .required()
    .min(6),
  new_password: joi.string()
    .required()
    .min(6),
  confirm_password: joi.any()
    .required()
    .equal(joi.ref('new_password'))
    .messages({'any.only': '{{#label}} does not match'}),
})

// Check In Location Validation | /routes/dashboard.route
exports.checkInValidation = joi.object({
  location: joi.string()
    .required()
    .length(24),
})

// Check Out Validation | /routes/dashboard.route
exports.checkOutValidation = joi.object({
  location: joi.string()
    .required()
    .length(24),
})

// Check Out Validation | /routes/dashboard.route
exports.getHistoryValidation = joi.object().keys({
  log: joi.string()
    .required()
    .max(5)
    .alphanum(),
})

// Change Password Validation | /routes/user.route
exports.userChangeProfileValidation = joi.object().keys({
  fullname: joi.string()
    .max(50),
  address: joi.string()
    .max(100),
  idcardnumber: joi.string()
    .length(16),
})
