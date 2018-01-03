var express    = require('express');
var router     = express.Router();
var config     = require('./config');
var passport  = require('passport');

// Passport initialize
router.use(passport.initialize());
router.use(passport.session());


// Route passport

/* POST Login verification. */
router.post('/login',
  passport.authenticate('local', {
    successRedirect : '/loginSuccess',
    failureRedirect: '/loginFailure',
    failureFlash: true
  }));

/* POST Login Failure. */
router.get('/loginFailure', function(req, res, next) {
  res.send({
    error: 'Failed to authenticate'
  });
});

/* POST Login Sucess. */
router.get('/loginSuccess', function(req, res, next) {
  console.log(req.user);
  res.send( {
    message: 'Successfully authenticated',
    user: req.user
  });
});

/* POST LogOut page. */
router.get('/logOut', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signIn', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;

  res.render( 'signin', {
    title: "SignIn",
    id: "signin",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

// End route passport


router.get('/', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || { error: false };
  var params = req.session.params || {};
  var user = req.user;
  res.render('index', {
    title: config.title,
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});


module.exports = router;