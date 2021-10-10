const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const user = require('../models/user');
const Rooms = require('../models/rooms'); 
const Tourguides = require('../models/tourGuide');
const { response } = require('../app');
const {authVerifyUser} = require('../authenticate');
const { tokenInfo } = require('../tokenInfo');
const { token } = require('morgan');
const { create } = require('../models/user');
const {authVerifyAdmin} = require('../authenticate');


const becomeAProviderRouter = express.Router();
becomeAProviderRouter.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) =>{
  //   const uniqueName = `${Date.now()}-${Math.round(
  //     Math.random() * 1e9
  // )}${path.extname(file.originalname)}`;
  // 3746674586-836534453.png
  cb(null, `${file.originalname}`); //uniqueName
  },
});
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

becomeAProviderRouter.route('/')
  .get((req, res, next) => {
    Rooms.find({})
    .then((rooms) =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rooms);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post( (req, res, next) => {
    handleMultipartData(req, res, async (err) => {
      if (err) {
          return next(err);
      }
      //const filePath = req.file.path; // "http://localhost:8000/" +
      const authHeader = req.headers["authorization"];
      console.log(authHeader, "SEE THIS");
       const token = authHeader && authHeader.split(" ")[1];

      let userId = tokenInfo(token);
      
      const { city, address, placeType, guests,bedrooms, bathrooms, mobNumber, otherServices, fee, checkin, confirmUser } = req.body;
      let document;
      try {
          document = await Rooms.create({
              city,
              address,
              placeType,
              guests,
              bedrooms,
              bathrooms,
              mobNumber,
              otherServices,
              fee,
              checkin, 
              confirmUser,
              OwnerOfPlace:userId,
              image:`http://localhost:8000/images/${req.file.filename}`,         //filePath  //'file:///E:/FYP/Project/server/'+
          });
      } catch (err) {
          return next(err);
      }
      res.status(201).json(document);
  });
})
  .put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /becomeAProvider');
  })
  .delete( (req, res, next) => {
    Rooms.remove({})
    .then((response) =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));
  });
  
// ***********************************************************
becomeAProviderRouter.route("/find")
.get((req, res, next) => {
  Rooms.find({}).limit(3)
  .then((rooms) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
  }, (err) => next(err))
  .catch((err) => next(err));
});
becomeAProviderRouter.route("/search/:city/:placeType/:fee")
.get((req, res, next) => {
  Rooms.find({city:req.params.city, placeType:req.params.placeType, fee:req.params.fee})
  .then((rooms) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
    console.log("rooms",rooms)
  }, (err) => next(err))
  .catch((err) => next(err));
})
becomeAProviderRouter.route("/search/:city")
.get((req, res, next) => {
  Rooms.find({city:req.params.city})
  .then((rooms) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
    console.log("rooms",rooms)
  }, (err) => next(err))
  .catch((err) => next(err));
})
//   .post( (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /becomeAProvider');
// })
//   .put( (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /becomeAProvider');
//   })
//   .delete( (req, res, next) => {
//     res.statusCode = 403;
//     res.end('DELETE operation not supported on /becomeAProvider');
//   });
/*************************************************************/
  becomeAProviderRouter.route('/:roomId')
 .get((req, res, next) => {
    Rooms.findById(req.params.roomId)
    .then((rooms) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rooms);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /becomeAProvider/ ' +req.params.roomId);
})
.put( (req, res, next) => {
  Rooms.findByIdAndUpdate(req.params.roomId, {
    $set: req.body
}, { new: true })
.then((room) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(room);
}, (err) => next(err))
.catch((err) => next(err));
})
.delete( (req, res, next) => {
   Rooms.findByIdAndRemove(req.params.roomId)
   .then((response) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  }, (err) => next(err))
  .catch((err) => next(err));
});
/*****************************************************************/
becomeAProviderRouter.route('/:roomId/comments')
.get((req, res, next) =>{
  Rooms.findById(req.params.roomId)
  .then((rooms) =>{
   if(room != null){
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(rooms.comment);
   }
   else{
      err = new Error('Room ' + room.params.roomId + ' not found!' );
      err.statusCode = 404;
      return next(err);
    }
  }, (err) => next(err))
   .catch((err) => next(err));
  })
  .post(authVerifyUser, (req, res, next) =>{
    console.log("req.headers = ",req.headers);
    let token =  req.headers["authorization"];
    let UserId = tokenInfo(token);
    Rooms.findById(req.params.roomId)
    .then((room) => {
        if (room != null) {
            req.body.author = UserId;
            room.comments.push(req.body);
            room.save()
            .then((room) => {
                Rooms.findById(room._id)
                .then((room) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(room);
                })                
            }, (err) => next(err));
        }
        else {
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
  })
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /rooms/' + req.params.roomId + '/comments');
})
.delete( (req, res, next) => {
  Rooms.findById(req.params.roomId)
  .then((room) => {
      if (room != null) {
          for (var i = (room.comments.length -1); i >= 0; i--) {
              room.comments.id(room.comments[i]._id).remove();
          }
          room.save()
          .then((room) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(room);                
          }, (err) => next(err));
      }
      else {
          err = new Error('Room ' + req.params.roomId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});
///////////////////////////////////////////////////////////////////////////////
becomeAProviderRouter.route('/:roomId/comments/:commentId')
.get((req,res,next) => {
    Rooms.findById(req.params.roomId)
    .then((room) => {
        if (room != null && room.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(room.comments.id(req.params.commentId));
        }
        else if (room == null) {
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /rooms/'+ req.params.roomId + '/comments/' + req.params.commentId);
})
.put( (req, res, next) => {
    Rooms.findById(req.params.roomId)
    .then((room) => {
        if (room != null && room.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                room.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                room.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            room.save()
            .then((room) => {
                Rooms.findById(room._id)
                .then((room) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(room);
                })
            }, (err) => next(err));
        }
        else if (room == null) {
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( (req, res, next) => {
    Rooms.findById(req.params.roomId)
    .then((room) => {
        if (room != null && room.comments.id(req.params.commentId) != null ){
           //room.comments./*id(req.params.commmenId).*/author._id.equals(req.user._id)) {
            room.comments.id(req.params.commentId).remove();
            room.save()
            .then((room) => {
                Rooms.findById(room._id)
                .then((room) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(room);
                })                
            }, (err) => next(err));
        
        }
        else if (room == null) {
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = becomeAProviderRouter;