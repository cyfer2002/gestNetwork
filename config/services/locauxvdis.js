var express    = require('express');
var router     = express.Router();
var babel = require('babel-core');
var path       = require('path');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db-config');

/*Import Fonction JS.es6 CheckForm*/
var checkLocauxVdisForm = eval(babel.transformFileSync(path.join(__dirname, '../../frontend/app/locauxVdis/check_form.es6'), {
  presets: ['env']
}).code);


router.post('/', function(req, res, next) {
  var errors = checkLocauxVdisForm(req.body);

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


  db.locauxvdis.create({
    batimentid: req.body.batimentid,
    etage: req.body.etage,
    aile: req.body.aile,
    nbarmoire: req.body.nbarmoire,
    description: req.body.description,
    created_at: new Date()
  }).then(function(result) {
    res.send({
      message: "le local VDI a été créé"
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

  db.locauxvdis.findAll({
    order:[
      ['batiment', 'DESC'],
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

module.exports = router;