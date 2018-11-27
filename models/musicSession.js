'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const musicSessionSchema = new Schema({
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
      enum: ['guitar', 'drums', 'bass', 'keyboard', 'trumpet', 'saxophone', 'strings', 'vocals'],
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

const MusicSession = mongoose.model('musicSession', musicSessionSchema)

module.exports = MusicSession
