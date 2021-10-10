const mongoose = require('mongoose');
const { model } = require('./dishes');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true  //no two documents should have the same name field in there
    },
    image:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true,
        unique: true
    },
    abbr:{
        type: String,
        required: true,
        unique:true
    },
    description:{
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
        default: false
    }
    },{
        timestamps: true   // mongoose will insert timestamp into our model, like createdAt and updatedAt
});
const Leaders = mongoose.model('leader', leaderSchema);
module.exports = Leaders;