const mongoose = require('mongoose')
const { Schema } = require('mongoose')
 
const attendanceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activity: {
    type: String,
    enum: ['in', 'out'],
    default: 'in'
  },
  locationName: {
    type: String
  },
  locationAddress: {
    type: String
  },
  locationImage: {
    type: String
  },
  createdAt: Date,
},
{
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
}
)

exports.attendanceModel = mongoose.model('Attendance', attendanceSchema)
