'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenum: {
    type: Number
    // required: true
  },
  instruments: [{
    type: String,
    enum: ['guitar', 'drums', 'bass', 'keyboard', 'trumpet', 'saxophone', 'strings', 'vocals']
    // required: true
  }],
  location: {
    type: String,
    trim: true
    // required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
