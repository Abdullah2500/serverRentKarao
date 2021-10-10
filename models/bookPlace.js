const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const bookedPlaceSchema = new Schema ({
    checkin:{
        type: Array,
        required: true    
    },
    placeBookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
},{ 
    timestamps:true
});

const PlaceBook = mongoose.model('PlaceBook', bookedPlaceSchema); //PlaceBook is Model and bookPlaceSchema is file export 
module.exports = PlaceBook;