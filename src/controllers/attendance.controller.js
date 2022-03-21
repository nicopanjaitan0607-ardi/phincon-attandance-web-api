const mongoose = require('mongoose')
const createError = require('http-errors')
const moment = require('moment')
const { checkInValidation, checkOutValidation, getHistoryValidation } = require('../helpers/validation.schema')
const { userModel } = require('../models/user.model')
const { attendanceModel } = require('../models/attendance.model')

exports.createCheckIn = async (req, res, next) => {
  try {
    await checkInValidation.validateAsync(req.body)

    const user = await userModel.find(
      {
        _id: mongoose.Types.ObjectId(req.payload.aud)
      },
      {
        location: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(req.body.location)
          }
        }
      }
    )

    const getlocation = user[0].location
    if (!getlocation.length) throw createError(404, 'Location not found')

    const newAttendance = {
      user: mongoose.Types.ObjectId(req.payload.aud),
      activity: 'in',
      locationName: getlocation[0].name,
      locationAddress: getlocation[0].address,
      locationImage: getlocation[0].image,
      createdAt: moment()
    }

    const result = await attendanceModel.create(newAttendance)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Check In has been successful'
      }
    })
  } catch (error) {
    if (error.isJoi === true)
      error = createError(422, error.message)

    next(error)
  }
}

exports.createCheckOut = async (req, res, next) => {
  try {
    await checkOutValidation.validateAsync(req.body)

    const user = await userModel.find(
      {
        _id: mongoose.Types.ObjectId(req.payload.aud)
      },
      {
        location: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(req.body.location)
          }
        }
      }
    )

    const getlocation = user[0].location
    if (!getlocation.length) throw createError(404, 'Location not found')

    const newAttendance = {
      user: mongoose.Types.ObjectId(req.payload.aud),
      activity: 'out',
      locationName: getlocation[0].name,
      locationAddress: getlocation[0].address,
      locationImage: getlocation[0].image,
      createdAt: moment()
    }

    const result = await attendanceModel.create(newAttendance)

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Check Out has been successful'
      }
    })
  } catch (error) {
    if (error.isJoi === true)
      error = createError(422, error.message)

    next(error)
  }
}

exports.getHistory = async (req, res, next) => {
  try {
    req.body = req.query
    await getHistoryValidation.validateAsync(req.body)

    const today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let startDate = moment(today).startOf('day')
    let endDate = moment(today).endOf('day')

    // 24 hours (00:00 - 23:59)
    if (req.body.log === 'day') {
      startDate = startDate
      endDate = endDate
    }

    // 7 days (0 - 6)
    if (req.body.log === 'week') {
      startDate = startDate.subtract(6, 'days')
      endDate = endDate.subtract(0, 'days')
    }

    // 30 days (0 - 29)
    if (req.body.log === 'month') {
      startDate = startDate.startOf('day').subtract(29, 'day')
      endDate = endDate.endOf('day').subtract(0, 'day')
    }

    // 365 days (0 - 364)
    if (req.body.log === 'year') {
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
    const result = await attendanceModel.find( query ).sort({ _id: 'desc' })

    // Send Response Success 
    res.send({
      success: {
        status: 200,
        message: 'Ok',
        count: count,
        result,
      }
    })
  } catch (error) {
    next(error)
  }
}
