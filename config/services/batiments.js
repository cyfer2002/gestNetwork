var express    = require('express');
var router     = express.Router();
var babel = require('babel-core');
var path       = require('path');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db-config');

/*Import Fonction JS.es6 CheckForm*/
var checkBatimentsForm = eval(babel.transformFileSync(path.join(__dirname, '../../frontend/app/batiments/check_form.es6'), {
  presets: ['env']
}).code);


router.post('/', function(req, res, next) {
  var errors = checkBatimentsForm(req.body);

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

  db.batiments.create({
    nombatiment: req.body.nombatiment,
    caractbatiment: req.body.caractbatiment,
    nbaile: req.body.nbaile,
    nbetageinf: req.body.nbetageinf,
    nbetagesup: req.body.nbetagesup,
    created_at: new Date()
  }).then(function(result) {
    console.log(result);
    res.send({
      message: "le Batiment " + result.nombatiment + " a été créé"
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
    return res.redirect('/');
  }
  error = {};

  db.batiments.findAll({
    order:[
      ['nombatiment', 'DESC']
    ]}).then(result =>{
    if (req.xhr) {
      return res.send({
        message: result,
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