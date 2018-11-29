'use strict';

const express = require('express');
const router = express.Router();

const moment = require('moment');
const MusicSession = require('../models/musicSession');

/* GET home page. */
router.get('/', (req, res, next) => {
  MusicSession.find({}).sort({ location: 1, startTime: 1 })
    .then((musicSessions) => {
      musicSessions.forEach(session => {
        session.formattedStartTime = moment(session.startTime).format('DD MMMM YYYY — HH:mm');
      });
      res.render('index', { title: 'Playvine', musicSessions });
    })
    .catch(next);
});

module.exports = router;
