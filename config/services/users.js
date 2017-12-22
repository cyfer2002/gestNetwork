var express    = require('express');
var router     = express.Router();
var babel = require('babel-core');
var path       = require('path');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db-config');

/*Import Fonction JS.es6 CheckForm*/
var checkUsersForm = eval(babel.transformFileSync(path.join(__dirname, '../../source/app/users/check_form.es6'), {
  presets: ['es2015']
}).code);


router.post('/', function(req, res, next) {
  var errors = checkUsersForm(req.body);

  // Vérification que l'utilisateur est loggé et a le droit d'ajouter un rôle, ainsi que le contenu n'ait pas été modifié durant le POST
  if (req.user) {
    if (req.user.role == "admin")
    {
      role = req.body.role;
    } else role = "view";
  } else role = "view";

  if (Object.keys(errors).length) {
    req.session.params = req.body;
    req.flash("danger", errors);
    return res.send({errors : errors});
  }
  errors = {};
  
  // Generate a salt
  var salt = bcrypt.genSaltSync(10);
  // Hash the password with the salt
  var password = bcrypt.hashSync(req.body.password, salt);

  db.user.create({
    username: req.body.username,
    name: req.body.name,
    lastName: req.body.lastName,
    password: password,
    role: role,
    email: req.body.email,
    created_at: new Date()
  }).then(function(user) {
    console.log(user);
    res.send({
      message: "L'utilisateur " + user.username + " a été créé"
    });
  }).catch(function (err) {
    // handle error;
    console.log(err);
    res.send({
      error: err.message
    })
  });
});

// Get operation
router.get('/', function(req, res, next) {
  var error = {};
  if (Object.keys(error).length) {
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/users/');
  }
  error = {};

  db.user.findAll({
    order:[
      ['created_at', 'DESC']
    ]}).then(news =>{
    if (req.xhr) {
      return res.send({
        message: news,
        user: req.user
      });
    }
  }).catch(function (err) {
    // handle error;
    console.log(err);
    res.send({
      error: err.message
    })
  });
});

module.exports = router;