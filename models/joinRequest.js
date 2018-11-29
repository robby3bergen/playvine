'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const joinRequestSchema = new Schema({
  joinerId: {
    type: objectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: objectId,
    ref: 'MusicSession',
    required: true
  },
  role: {
    type: String,
    enum: ['guitar', 'drums', 'bass', 'keyboard', 'trumpet', 'saxophone', 'strings', 'vocals'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    required: true,
    default: 'Pending'
  }
});

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

module.exports = JoinRequest;
