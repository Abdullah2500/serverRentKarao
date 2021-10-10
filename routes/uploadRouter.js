const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

function uploadImage(req, res, next){
const storage = multer.diskStorage({ // 2 configurtion supplying to the disk storage
      destination: (req, file, cb) =>{
      cb(null, 'public/images');
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname); //multer will save the file with original name instead of random string
  }
});

const imageFileFilter = (req, file, cb) => { //will filter the image 
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can only upload image files!'), false);
    }
    cb(null, true)
};

const upload = multer({storage: storage, fileFilter: imageFileFilter}).single('imageFile');
return upload;
}
// const uploadRouter = express.Router();

// uploadRouter.use(bodyParser.json());

// uploadRouter.route('/')
// .get((req, res, next) => {
//     res.statusCode = 403;
//     res.end('GET operation not supported on /imageUpload');
// })
// .post(upload.single('imageFile'), (req, res) => {
//    res.statusCode = 200;
//    res.setHeader('Content-Type', 'application/json');
//    res.json(req.file);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /imageUpload');
// })
// .delete((req, res, next) => {
//     res.statusCode = 403;
//     res.end('DELETE operation not supported on /imageUpload');
// });
// module.exports = uploadRouter;