'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const sessionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  roles: [{
    instrument: {
      type: String,
      enum: ['Guitar', 'Drums', 'Bass', 'Keyboard', 'Trumpet', 'Saxophone', 'Strings', 'Vocals'],
      required: true
    },
    requests: [{
      type: ObjectId,
      ref: 'Request'
    }]
  }],
  sessionInfo: {
    type: String,
    required: true
  },
  creatorId: {
    type: ObjectId,
    ref: 'User'
  }
})

const _Session = mongoose.model('_Session', sessionSchema)

module.exports = _Session
