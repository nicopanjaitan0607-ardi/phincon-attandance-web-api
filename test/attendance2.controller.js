const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const createError = require('http-errors')
const moment = require('moment')
const { attendanceModel } = require('../models/attendance.model')
const { userModel } = require('../models/user.model')
const { checkInValidation, checkOutValidation, getHistoryValidation } = require('../helpers/validation.schema')

exports.getHistory = async (req, res, next) => {
  try {
    // Check Body Validation
    req.body = req.query
    await getHistoryValidation.validateAsync(req.body)
    const testParams = req.query.log

    const today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let startDate = moment(today).startOf('day')
    let endDate = moment(today).endOf('day')

    let getLog = req.body.log

    // 24 hours (00:00 - 23:59)
    if (getLog === 'day') {
      startDate = startDate
      endDate = endDate
    }

    // 7 days (0 - 6)
    if (getLog === 'week') {
      startDate = startDate.subtract(6, 'days')
      endDate = endDate.subtract(0, 'days')
    }

    // 30 days (0 - 29)
    if (getLog === 'month') {
      startDate = startDate.startOf('day').subtract(29, 'day')
      endDate = endDate.endOf('day').subtract(0, 'day')
    }

    // 365 days (0 - 364)
    if (getLog === 'year') {
      startDate = startDate.subtract(364, 'day')
      endDate = endDate.subtract(0, 'day')
    }

    const query = {
      user: mongoose.Types.ObjectId(req.payload.aud),
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const count = await attendanceModel.countDocuments( query )
    const results = await attendanceModel.find( query ).sort({ _id: 'desc' })

    // Send Response Success
    res.send({
      success: {
        status: 200,
        message: 'Ok.',
        count: count,
        // data,
        // results
      }
    })

    // const results = await attendanceModel.aggregate([
    //   {
    //     $match:
    //     { 
    //       // user: mongoose.Types.ObjectId(req.payload.aud),
    //       user: {
    //         $in: [mongoose.Types.ObjectId(req.payload.aud)]
    //       },
    //       createdAt: {
    //         $gte: new Date(startDate),
    //         $lte: new Date(endDate)
    //       }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: '$user',
    //       total: {
    //         $sum: 1
    //       }
    //       // 'id': { $_id },
    //       // date: { '$createdAt' },
    //     }
    //   }
    // ])

  } catch (error) {
    if (error.isJoi === true)
      error = createError(422, error.message)

    next(error)
  }
}

exports.checkIn = async (req, res, next) => {
  try {
    // Check In Validation
    await checkInValidation.validateAsync(req.body)

    // Get User Data
    const user = await userModel.findById(req.payload.aud)

    // Get Location
    let location = user.locations.filter(function (obj) {
      return obj._id == req.body.location
    })
    location = location[0]

    // Set Time Attendance
    const today = new Date()
    // const txtMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const setMinutes = '0' + today.getMinutes()
    const formattedTime = today.getHours() + ':' + setMinutes.substr(-2)

    // Set Attendance
    const data = {
      user: req.payload.aud,
      activity: 'in',
      location: {
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      time: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
        clock: formattedTime
      },
      createdAt: today
    }

    // Create New Attendance
    const results = await attendanceModel.create(data)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Check In has been successful.',
        results
      }
    })

  } catch (error) {
    // Error Handler Validation
    if (error.isJoi === true) {
      error = createError.UnprocessableEntity(error.message)
    }

    next(error)
  }
}

exports.checkOut = async (req, res, next) => {
  try {
    // Check Out Validation
    await checkOutValidation.validateAsync(req.body)

    // Get User Data
    const user = await userModel.findById(req.payload.aud)

    // Get Location
    let location = user.locations.filter(function (obj) {
      return obj._id == req.body.location
    })
    location = location[0]

    // Set Time Attendance
    let newDay = '2022-03-' + req.body.tanggal
    const today = new Date(newDay)
    // const today = new Date('2022-03-20 23:59:00')
    // const txtMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const setMinutes = '0' + today.getMinutes()
    const formattedTime = today.getHours() + ':' + setMinutes.substr(-2)
    const tempTime = today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    const timeNumber = today.valueOf()

    // Set Attendance
    const data = {
      user: req.payload.aud,
      activity: 'out',
      location: {
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      // timeDate: today.getDate(),
      // timeMonth: today.getMonth() + 1,
      // timeYear: today.getFullYear(),
      // timeClock: formattedTime,
      // time: {
      //   year: today.getFullYear(),
      //   month: today.getMonth() + 1,
      //   date: today.getDate(),
      //   clock: formattedTime
      // },
      tempTime: tempTime,
      timeNumber, timeNumber,
      createdAt: today
    }

    // Create New Attendance
    const results = await attendanceModel.create(data)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Check Out has been successful.',
        results
      }
    })

  } catch (error) {
    // Error Handler Validation
    if (error.isJoi === true) {
      error = createError.UnprocessableEntity(error.message)
    }

    next(error)
  }
}

exports.test = async (req, res, next) => {
  try {
    const today = new Date(req.body.tanggal)
    const data = {
      user: '6228fe72c129881fac0c920e',
      activity: 'out',
      locationName: 'PT Phincon',
      locationAddress: 'Office 88 @Kasablanka, 18th Floor, Jl. Raya Casablanca, Jakarta Selatan',
      createdAt: today
    }

    const results = await attendanceModel.create(data)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Ok.',
        results
      }
    })

  } catch (error) {
    next(error)
  }

}

// exports.readLocation = async (req, res, next) => {
//   try {
//     const result = await userModel.findById(req.payload.aud)

//     let responseStatus = 0
//     let responseMessage = ''
//     let locations = []

//     // Check Array Location
//     if (result.locations.length == 0) {
//       responseStatus = 201
//       responseMessage = 'Location does not exist yet.'
//       locations = null
//     } else {
//       responseStatus = 200
//       responseMessage = 'Ok.'
//       locations = result.locations
//     }

//     // Send Response Success 
//     res.send({
//       success: {
//         status: responseStatus,
//         message: responseMessage,
//         results: {
//           locations
//         }
//       }
//     })
//   } catch (error) {
//     next(error)
//   }
// }
