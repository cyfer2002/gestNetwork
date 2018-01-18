var express    = require('express');
var router     = express.Router();
var babel = require('babel-core');
var path       = require('path');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db-config');

/*Import Fonction JS.es6 CheckForm*/
var checkBandeauxForm = eval(babel.transformFileSync(path.join(__dirname, '../../frontend/app/bandeauxReseaux/check_form.es6'), {
  presets: ['env']
}).code);


router.post('/', function(req, res, next) {

  var errors = checkBandeauxForm(req.body);

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

  db.bandeauxreseaux.count({
    where:{
      armoireid: req.body.armoireid
    }
  }).then(c => {
    for (var i = 1; i <= req.body.nbbandeau; ++i) {
      db.bandeauxreseaux.create({
        armoireid: req.body.armoireid,
        nbprises: req.body.nbprises,
        numerobandeau: c+i,
        aile: req.body.aile,
        nbarmoire: "",
        description: req.body.description,
        created_at: new Date()
      }).then(result =>{
        if(i>=req.body.nbbandeau){
          res.send({
            message: "Le(s) bandeau(x) vienne(nt) d'être créé(s)"
          })
        }
      }).catch(function (err) {
        // handle error;
        console.log(err);
        res.send({
          error: err.message
        });
      });
    }
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