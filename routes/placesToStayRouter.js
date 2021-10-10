const express = require('express');
const bodyParser = require('body-parser');

const placesToStayRouter = express.Router();

placesToStayRouter.use(bodyParser.json());

placesToStayRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res, next) => {
    res.end('Will Send all the dishes to you!');
  })
  .post((req, res, next) => {
    res.end('Will add the dish: ' +req.body.name +' With details '+req.body.description);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /placesToStay');
  })
  .delete((req, res, next) => {
    res.end('Deleting all the dishes!');
  });


  placesToStayRouter.route('/:dishId')
 .get((req, res, next) => {
  res.end('Will Send details of the dish: '+req.params.dishId + ' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/' +req.params.dishId);
})
.put((req, res, next) => {
   res.write('Updating the dish' +req.params.dishId + '\n');
   res.end('will update the dish:' +req.body.name + ' with details '+req.body.description);  
})
.delete((req, res, next) => {
  res.end('Deleting the dish! '+req.params.dishId);
});
  module.exports = placesToStayRouter;