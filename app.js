var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var static = require('serve-static');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var session = require('client-sessions');
var config = require('./config/config');
var LocalStrategy = require('passport-local').Strategy;
var passport  = require('passport');


// Variable base de données
var db = require('./config/db-config');

var routes = require('./config/routes');
var armoiresReseaux = require('./config/services/armoiresReseaux');
var batiments = require('./config/services/batiments');
var bandeauxReseaux = require('./config/services/bandeauxReseaux');
var locauxVdis = require('./config/services/locauxvdis');

var app = express();


// Sessions
app.use(session({
  cookieName: 'session',
  secret: 'skadkshdjhaskjdhueopqoeqpeqmncjxuch',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Passport Config
app.use(passport.initialize());
app.use(passport.session());


// Generate a salt
var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt
var password = bcrypt.hashSync("thalassa", salt);

db.users.create({
  username: "admin",
  name: "test",
  lastName: "TEST",
  password: password,
  role: "admin",
  email: "nvatin@chu-besancon.fr",
  created_at: new Date()
});


passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    db.users.findOne({
      where : {
        username : username
      }
    }).then(result => {
      if (result) {
        if (bcrypt.compareSync(password, result.password)) {
          return done(null, result);
        }
        else return done(null, false);
      }
      else return done(null, false);
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);
app.use('/armoiresReseaux', armoiresReseaux);
app.use('/bandeauxReseaux', bandeauxReseaux);
app.use('/batiments', batiments);
app.use('/locauxVdis', locauxVdis);


// Bundles
app.use('/', express.static(__dirname + '/static'));
app.use('/images', express.static(__dirname + '/frontend/images'));
app.use('/fonts', express.static(__dirname + '/frontend/fonts'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var success = req.session.success;
    var errors = req.session.errors || {};
    var params = req.session.params || {};
    var user = req.user;
    res.status(err.status || 500);
    res.render('error', {
      title: config.title,
      message: err.message,
      params: params,
      success: success,
      errors: errors,
      user: user,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.status(err.status || 500);
  res.render('error', {
    title: config.title,
    message: err.message,
    params: params,
    success: success,
    errors: errors,
    user: user,
    error: {}
  });
});

if (app.get('env') === 'production') {
  var assetManifestPath = path.join(__dirname, 'public', 'assets', 'webpack-asset-manifest.json');
  if (fs.existsSync(assetManifestPath)) {
    app.locals.assetManifest = JSON.parse(fs.readFileSync(assetManifestPath));
  }
}

app.locals.environment = app.get('env');
app.locals.company = config.company;
app.locals.moment = require('moment');

module.exports = app;
