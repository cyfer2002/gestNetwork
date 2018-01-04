var express    = require('express');
var router     = express.Router();
var babel = require('babel-core');
var path       = require('path');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db-config');

/*Import Fonction JS.es6 CheckForm*/
var checkArmoiresReseauxForm = eval(babel.transformFileSync(path.join(__dirname, '../../frontend/app/armoiresReseaux/check_form.es6'), {
  presets: ['env']
}).code);


router.post('/', function(req, res, next) {
  var errors = checkArmoiresReseauxForm(req.body);

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


  db.armoiresReseaux.create({
    localvdiid: req.body.localvdiid,
    numeroarmoire: req.body.numeroarmoire,
    numerobandeau: req.body.numerobandeau,
    nbswitch: req.body.nbswitch,
    created_at: new Date()
  }).then(function(result) {
    console.log(result);
    res.send({
      message: "L'armoire Reseau a été créé"
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
    return res.redirect('/locauxVdis/');
  }
  error = {};

  db.armoiresReseaux.findAll({
    order:[
      ['numeroarmoire', 'DESC'],
      ['etage', 'DESC'],
      ['aile', 'DESC']
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


// Get operation
router.get('/:id', function(req, res, next) {
  var error = {};
  if (Object.keys(error).length) {
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/locauxVdis/');
  }
  error = {};

  db.armoiresReseaux.findById(id)
    .then(armoire =>{
    if (req.xhr) {
      return res.send({
        message: armoire,
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