var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('./connection');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var cors = require('cors');
var app = express();


///////////////////////////* Basic Connections *////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongo.connect();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////* Routers *////////////////////////////

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);


/////////////////* Catch 404 and Forward to Error Handler *///////////////////

app.use(function(req, res, next) {
  next(createError(404));
});

///////////////////////////* Error Handler *////////////////////////////

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


///////////////////////////* Setting Port *////////////////////////////

var port =process.env.PORT || '3001';
app.set('port', port);
app.listen(port, () => console.log(`Server is stated on http://localhost:${port}`));


module.exports = app;