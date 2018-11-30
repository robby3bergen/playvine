'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

const users = [
  {
    username: 'Beyoncé',
    password: bcrypt.hashSync('beyonce1', salt),
    phonenum: 12025550104,
    instruments: 'vocals',
    location: 'Houston, Texas'
  },
  {
    username: 'JRudess',
    password: bcrypt.hashSync('jordanrudess', salt),
    phonenum: 12025550130,
    instruments: 'keyboard',
    location: 'New York, New York'
  },
  {
    username: 'Ceci',
    password: bcrypt.hashSync('ceciceci', salt),
    phonenum: 34644468383,
    instruments: 'vocals',
    location: 'Barcelona, Catalonya'
  },
  {
    username: 'Robby',
    password: bcrypt.hashSync('12345678', salt),
    phonenum: 34644366366,
    instruments: 'guitar',
    location: 'Barcelona, Catalonya'
  }
];

User.create(users)
  .then(() => {
    console.log('Users was created');
    mongoose.connection.close();
  })
  .catch(error => {
    console.error(error);
  });
