var express    = require('express');
var router     = express.Router();
var config     = require('./config');

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