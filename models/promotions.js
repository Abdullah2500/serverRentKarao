const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true //no two documents should have the same name field in there
    },
    image:{
        type: String,
        required: true //every document will have the name as a required field there
    },
    label:{
        type: String,
        default: ''
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: true, 
        unique: true  
    },
    featured:{
        type: Boolean,
        default: false
    }
},{
        timestamps: true // mongoose will insert timestamp into our model, like createdAt and updatedAt
});

var Promotions = mongoose.model('Promo', promoSchema);
module.exports = Promotions;