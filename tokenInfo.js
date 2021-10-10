const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

exports.tokenInfo = (token) =>{
    if(token.startsWith('bearer')){
        token = token.slice(7, token.length).trimLeft();

    }

        const decoded = jwt.verify(token, '12345-67890-09876-54321');
        let userId = decoded.userId;
        //console.log("UserId Here of TokenInfo",userId);
        return userId;
    
}