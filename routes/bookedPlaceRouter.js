const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Rooms = require('../models/rooms'); 
const { response } = require('../app');
const {authVerifyUser} = require('../authenticate');
const { tokenInfo } = require('../tokenInfo');
const { token } = require('morgan');
const { create } = require('../models/user');
const {authVerifyAdmin} = require('../authenticate');
const BookedRoom = require("../models/bookedRoom");
const braintree = require("braintree");
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'qb47kskk97nztf3f',
  publicKey: 'wddjbth339mnwdf4',
  privateKey: '2c0443e8e8cbb28f5439ed8f15f047e9',
});

const bookedPlaceRouter = express.Router();
bookedPlaceRouter.use(bodyParser.json());
bookedPlaceRouter.route("/search").post(async(req, res)=>{
  
  const {city, placeType,fee} = req.body;
  let query = {};
  if(!city || city?.length==0) {
    
    query= {placeType:placeType, fee:{$lte:fee}}
  }else {
    
   query =  {placeType:placeType, fee:{$lte:fee},$or: [
    
   
      {
        address: { $regex: req.body.city, $options: "i" },
      },
      {
        city: { $regex: req.body.city, $options: "i" },
      },
      {
        bathrooms: { $regex: req.body.city, $options: "i" },
      },
      {
        fee: { $regex: req.body.city, $options: "i" },
      },
    ]}
  }
  const rooms =await Rooms.find(query);
// res.send(rooms);
  return res.status(200).json({
    success:true,
    message:"data found",
    data: rooms
  })
})

bookedPlaceRouter.route('/:placeId')
  .get((req, res, next) => {
    Rooms.find({})
    .then((rooms) =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rooms);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post(authVerifyUser, async(req, res, next) => {
      const accountSid = "AC7b2255cf2b0baed6c6ebc51e4685abee";
      const authToken = "efa792b980b458ef770b20dca9cfa5c2";
      const client = require('twilio')(accountSid, authToken);
      const authHeader = req.headers["authorization"];
      console.log(authHeader, "SEE THIS");
       const token = authHeader && authHeader.split(" ")[1];
      let userId = tokenInfo(token);
      const placeId = mongoose.Types.ObjectId(req.params.placeId)
      const checkin  = req.body.checkin;
      console.log('req.params.placeId ',placeId)
      //console.log('checkin = ',req.body);
     // let document;
      // try {
        const place = await Rooms.findOne({_id:placeId,placeStatus:{$ne:"booked"}} );
        if(!place)return res.status(400).json({success:false,message:"room not found"})
        place.confirmUser=userId;
        place.checkin = checkin;
        place.checkout = req.body.checkout;
        place.placeStatus = "booked";
        place.save();
        const nonceFromTheClient = req.body.paymentMethodNonce;
    const newTransaction = await gateway.transaction.sale({
      amount: place.fee,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    });
    if(!newTransaction) {
      return res.status(400).json({
        success:false,
        message:"Token not returned by braintree, try again"
      })
    }
    await BookedRoom.create({
      room:place._id,
      bookedBy: req.decoded.id,
      fee: place.fee
    });
        const phoneNumber = place.mobNumber;
        client.messages.create({
          body:"Hey..Your place has been booked",
          from:"+12672720072",
          to:phoneNumber

        })        
      //     document =  PlaceBook.create({
      //         checkin,
      //         placeBookedBy:userId,        
      //     });
      //     let plus = "+92";
      // } catch (err) {
      //     return next(err);
      // }
      // res.status(201).json(document);
})
  
  .put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /bookedPlace');
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

  module.exports = bookedPlaceRouter;