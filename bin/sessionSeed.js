'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const MusicSession = require('../models/musicSession');
const User = require('../models/user');

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

const usersWithIds = [];

const musicsessions = [
  {
    name: 'Beyoncé in Barcelona - Backup singer needed',
    startTime: '2019-04-07T20:00:00Z',
    location: 'Estadi Olimpic, Barcelona',
    roles: [{ requests: [], instrument: 'vocals' }],
    sessionInfo: 'I\'m back to Barcelona next year, looking for a backup singer for the concert. Can you sing and dance while wearing 7 inch heels and not break a sweat? We\'re looking for you'
  },
  {
    name: 'Tango in the Terrace, bring your drinks!',
    startTime: '2018-12-21T19:30:00Z',
    location: 'Ironhack Barcelona - The Terrace',
    roles: [{ requests: [], instrument: 'keyboard' }],
    sessionInfo: 'Bootcamp is over! Let\'s celebrate playing some tango. We\'ve a guitarist, drummer and singer, but we still need an experienced keyboardist to add the real spice. Wanna join?'
  },
  {
    name: 'I just want someone to play with :c',
    startTime: '2019-01-11T15:00:00Z',
    location: 'Parc de la Ciutadella, Barcelona',
    roles: [{ requests: [], instrument: 'guitar' }, { requests: [], instrument: 'drums' }, { requests: [], instrument: 'bass' }, { requests: [], instrument: 'keyboard' }, { requests: [], instrument: 'trumpet' }, { requests: [], instrument: 'saxophone' }, { requests: [], instrument: 'strings' }, { requests: [], instrument: 'vocals' }],
    sessionInfo: 'I play the ukulele and sing at the park every Sunday, but it feels a bit lonely so I want to play together. Your experience/instrument doesn\'t matter, let\'s have fun!'
  }

];

User.find().sort({ username: 1 })
  .then(users => {
    users.forEach(user => {
      usersWithIds.push(user._id);
    });
    console.log(usersWithIds);
    musicsessions[0].creatorId = usersWithIds[0];
    musicsessions[1].creatorId = usersWithIds[3];
    musicsessions[2].creatorId = usersWithIds[1];
    MusicSession.create(musicsessions)
      .then(() => {
        console.log('Musicsessions was created');
        mongoose.connection.close();
      })
      .catch(error => {
        console.error(error);
      });
  })
  .catch();
