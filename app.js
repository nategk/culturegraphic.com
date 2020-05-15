var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware') // ADDED

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // NOTE had to manually switch this in Express

// global dataset
global.workExperience = require('./data/work-experience.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// ADDED:
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// redirect previous known URLs
app.get('/about', (req, res, next) => {
    res.redirect(301, '/');
});
app.get('/project/*', (req, res, next) => {
    res.redirect(301, '/');
});

// Force secure
app.use(function(request, response){
  if(!request.secure){
    response.redirect("https://" + request.headers.host + request.url);
  }
});

// redirect Heroku URL to live domain
app.use(function forceLiveDomain(req, res, next) {
  var host = req.get('Host');
  if (host === 'culturegraphic.herokuapp.com') {
    return res.redirect(301, 'https://www.culturegraphic.com/' + req.originalUrl);
  }
  return next();
});

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
