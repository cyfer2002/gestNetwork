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
  var locaux;

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

  db.locauxvdis.findAll({
    where: {
      batimentid: req.body.batimentid,
      etage: req.body.etage,
      aile: req.body.aile
    }
  }).then(result => {
    console.log(JSON.stringify(result));
    if (!result.length) {
      db.locauxvdis.create({
        batimentid: req.body.batimentid,
        etage: req.body.etage,
        aile: req.body.aile,
        nbarmoire: req.body.nbarmoire,
        description: req.body.description,
        created_at: new Date()
      }).then(function(result) {
        for (var i = 1; i <= req.body.nbarmoire; ++i){
          db.armoiresreseaux.count().then(c => {
            db.armoiresreseaux.create({
              localvdiid: result.localvdiid,
              numeroarmoire: c+1,
              created_at:new Date()
            }).catch(function (err) {
              // handle error;
              console.log(err);
              res.send({
                error: err.message
              });
            });
          })
        }
        res.send({
          message: "le local VDI a été créé, ainsi que les armoires réseaux."
        });
      }).catch(function (err) {
        // handle error;
        console.log(err);
        res.send({
          error: err.message
        })
      });
    }else {
      res.send({
        error: "le local VDI existe déjà."
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
    return res.redirect('/locauxVdis/');
  }
  error = {};

  db.locauxvdis.findAll({
    order:[
      ['batimentid', 'DESC'],
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
router.get('/:batimentid', function(req, res, next) {
  var error = {};
  if (Object.keys(error).length) {
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/locauxVdis/');
  }
  error = {};

  db.locauxvdis.findAll({
    where:{
      batimentid: req.params.batimentid
    },
    order:[
      ['localvdiid', 'DESC'],
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
router.get('/aile/:aile', function(req, res, next) {
  var error = {};
  if (Object.keys(error).length) {
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/locauxVdis/');
  }
  error = {};

  db.locauxvdis.findAll({
    where:{
      aile: req.params.aile
    },
    order:[
      ['localvdiid', 'DESC'],
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