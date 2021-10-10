const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const tourGuideSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true
       },
    address:{
        type: String,
        required: true
    },
    education:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    languages:{
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    availableArea:{
      type: String,
      required: true
    },
    age:{
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    fee:{
        type: Number,
        min: 0,
        max: 50000,
        required: true
    },
    mobNumber:{
        type: Number,
        required: true
    },
    introduction:{
        type: String,
        required: true
    },image: { 
        type: String, 
        required: true
    },
},{ 
    timestamps:true
});
const Tourguides = mongoose.model('Tourguide', tourGuideSchema);
module.exports = Tourguides;