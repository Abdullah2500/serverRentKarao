var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type: String,
        default:''
    },
    lastname:{
        type: String,
        default:''
    },
    username:
    {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    }
    
});

//User.plugin(passportLocalMongoose); // to use that as an plugin in our mongoose schema and model this will add username and hashed storage of the passowrd automaticlly using the hash and salt
module.exports = mongoose.model('User', User); // 'User' is the mongoose model and User is the schema we have created
