const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
       type: String,
       required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
  },{
      timestamps: true
    
    
  });

const roomSchema = new Schema ({
    city:{
     type: String,
     required: true
    },
    address:{
        type: String,
        required: true
        
     },
   placeType:{
        type: String,
        required:true
    },
    guests:{
        type: String,
        required: true
    },
    bedrooms:{
        type: String,
        required: true
    },
    bathrooms:{
        type: String,
        required:true
    },
    mobNumber:{
        type: Number,
        required: true
    },
    otherServices:{
     type: Array,
     required: true
    },
    fee:{
        type: String,
        // type:Number,
        // min:0,
        // max:30000,
        required:true 
    },
    OwnerOfPlace: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    image: { 
        type: String, 
        required: true
    },
    placeStatus:{
      type: String,
      default:"active"
    },
    checkin:{
        type: Date,
    },
    checkout:{
        type: Date,
    },
    confirmUser:{
     type: Schema.Types.ObjectId,
     ref: 'User'
    },
    comments: [ commentSchema ]
},{ 
    timestamps:true
});

const Rooms = mongoose.model('Rooms', roomSchema); //Rooms is Model and roomSchema is file export 
module.exports = Rooms;








