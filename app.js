var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());
const http = require('http').createServer(app);

// Importing Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var placesToStayRouter = require('./routes/placesToStayRouter');
var becomeAProviderRouter = require('./routes/becomeAProviderRouter');
var onlineExperienceRouter = require('./routes/onlineExperienceRouter');
var tourGuideRouter = require('./routes/tourGuideRouter');
var bookedPlaceRouter = require('./routes/bookedPlaceRouter');


const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Rooms = require('./models/rooms');
var port =process.env.PORT || '8000';

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useCreateIndex: true
});
connect.then((db) =>{
console.log('DB Conneted!');
}, (err) =>{ console.log(err); });

//app.listen(port);
//if error occurs in project then remove http.listen and use app.listen above 
http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.use(express.static(__dirname + '/public'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('Connected...')
  socket.on('message', (msg) => {
      socket.broadcast.emit('message', msg)
  })

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

global.appRoot = path.resolve(__dirname);// If some error occurs then remove this it is from multer youtube

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter); 

app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public/images')));

// REST API Server serve up for placesToStay, becomeAProvider, onlineExpreience 

app.use('/placesToStay', placesToStayRouter);
app.use('/becomeAProvider', becomeAProviderRouter);
app.use('/onlineExperience', onlineExperienceRouter);
app.use('/tourGuide', tourGuideRouter);
app.use('/bookedPlace', bookedPlaceRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
