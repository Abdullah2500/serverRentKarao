const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tourguides = require('../models/tourGuide');
const tourGuideRouter = express.Router();
// tourGuideRouter.use(bodyParser.json());
const BookedTourGuides = require("../models/BookedTourGuides");
const { authVerifyUser } = require("../authenticate")
const braintree = require("braintree");
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'qb47kskk97nztf3f',
  publicKey: 'wddjbth339mnwdf4',
  privateKey: '2c0443e8e8cbb28f5439ed8f15f047e9',
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => {
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


tourGuideRouter.route('/')
  .get((req, res, next) => {
    Tourguides.find({})
      .then((tourguides) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tourguides)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      const filePath = req.file.path;
      console.log('filePath = ', filePath);
      const { name, city, address, education, experience, languages, availableArea, age, fee, mobNumber, introduction } = req.body;
      let document;
      try {
        document = await Tourguides.create({
          name,
          city,
          address,
          education,
          experience,
          languages,
          availableArea,
          age,
          fee,
          mobNumber,
          introduction,
          image: `http://localhost:8000/images/${req.file.filename}`,
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported for /tourGuide');
  })
  .delete((req, res, next) => {
    Tourguides.remove({})
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


tourGuideRouter.route("/token").get(async (req, res) => {
  console.log("OOO");
  const clientToken = await gateway.clientToken.generate({

  });
  if (!clientToken) {
    return res.status(400).json({
      success: false,
      message: "token not found"
    });
  }
  return res.status(200).json({
    success: true,
    clientToken
  });
})

tourGuideRouter.route("/search").get(async (req, res) => {
  let query = {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },

      {
        education: { $regex: req.query.search, $options: "i" },
      },
      {
        city: { $regex: req.query.search, $options: "i" },
      },
      {
        address: { $regex: req.query.search, $options: "i" },
      },
      {
        availableArea: { $regex: req.query.search, $options: "i" },
      },
    ],
  };

  const tourGuides = await Tourguides.find(query);
  return res.status(200).json({ success: true, message: "Tour guides found successfully!", data: tourGuides })
});

tourGuideRouter.route("/:id/book").post(authVerifyUser, async (req, res) => {
  const id = req.params.id;
  const tourGuide = await Tourguides.findById(id);
  if (!tourGuide) {
    return res.status(400).json({
      success: false, message: "Tour Guide not found"
    });
  }


  const nonceFromTheClient = req.body.paymentMethodNonce;
  const newTransaction = await gateway.transaction.sale({
    amount: tourGuide.fee,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true,
    },
  });
  if (!newTransaction) {
    return res.status(400).json({
      success: false,
      message: "Token not returned by braintree, try again"
    })
  }
  await BookedTourGuides.create({
    tourGuide: tourGuide._id,
    bookedBy: req.decoded.id,
    fee: tourGuide.fee
  });
  return res.status(201), json({ success: false, message: "Tour guide booked successfully" });


});

tourGuideRouter.route('/:tourGuideId')
  .get((req, res, next) => {
    Tourguides.findById(req.params.tourGuideId)
      .then((tourguides) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tourguides);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tourGuideId');
  })
  .put((req, res, next) => {
    Tourguides.findByIdAndUpdate(req.params.tourGuideId, {
      $set: req.body
    }, { new: true })
      .then((tourguide) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tourguide);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Tourguides.findByIdAndRemove(req.params.tourGuideId)
      .then((tourguide) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tourguide)
      }, (err) => next(err))
      .catch((err) => next(err));
  });

tourGuideRouter.route("/search/:city/:experience/:fee")
  .get((req, res, next) => {
    Tourguides.find({ city: req.params.city, experience: req.params.experience, fee: req.params.fee })
      .then((tourguide) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tourguide);
        console.log("rooms", tourguide)
      }, (err) => next(err))
      .catch((err) => next(err));
  })

module.exports = tourGuideRouter;