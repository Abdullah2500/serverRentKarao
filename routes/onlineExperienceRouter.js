const express = require('express');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
//const authenticate = require('../authenticate');
//const Rooms = require('../models/rooms');

const onlineExperienceRouter = express.Router();

onlineExperienceRouter.use(bodyParser.json());

onlineExperienceRouter.route('/')
  .get((req, res, next) => {
    res.end('Will Send all the Places to you!');
  })
  .post((req, res, next) => {
    res.end('Will add the Places: ' +req.body.name +' With details '+req.body.description);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Places');
  })
  .delete((req, res, next) => {
    res.end('Deleting all the Places!');
  });


  onlineExperienceRouter.route('/:onlineExperienceId')
 .get((req, res, next) => {
  res.end('Will Send details of the Places: '+req.params.onlineExperienceId + ' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Places/' +req.params.onlineExperienceId);
})
.put((req, res, next) => {
   res.write('Updating the Places ' +req.params.onlineExperienceId + '\n');
   res.end('will update the Places: ' +req.body.name + ' with details '+req.body.description);  
})
.delete((req, res, next) => {
  res.end('Deleting the Places! '+req.params.onlineExperienceId);
});

module.exports = onlineExperienceRouter;