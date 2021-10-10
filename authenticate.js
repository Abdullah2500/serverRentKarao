var User = require('./models/user');
var jwt = require('jsonwebtoken'); //importing jsonwebtoken node module that we installed
var config = require('./config');
const { tokenInfo } = require('./tokenInfo');

exports.authVerifyUser =function (req, res, next){

    const authHeader = req.headers["authorization"];
    console.log(authHeader, "SEE THIS");
    const token = authHeader && authHeader.split(" ")[1];

    console.log("token", token);
    jwt.verify(token, "12345-67890-09876-54321", (err, decoded)=>{
        console.log(err);
        if(err)
        return res.sendStatus(403);
        req.decoded = decoded;
        next();
    });
}
exports.authVerifyAdmin = function (req, res, next){
    const authHeader = req.headers["authorization"];
    console.log(authHeader, "SEE THIS");
    const token = authHeader && authHeader.split(" ")[1];

   let userId = tokenInfo(token);
   console.log('userId = ',userId);
   const user = User.findOne({_id:userId}).lean().exec(function (err, user) { 
    if(user.admin === true){
        next();
        }
        else{
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         return next(err);
     }     
   });
}
