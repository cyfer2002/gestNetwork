var express    = require('express');
var router     = express.Router();
var config     = require('./config');
var passport   = require('passport');
var babel      = require('babel-core');
var nodemailer = require('nodemailer');
var path       = require('path');
var fs         = require('fs');
var db         = require('./db-config');

// Passport initialize
router.use(passport.initialize());
router.use(passport.session());

// Import es6 file
var checkContactForm = eval(babel.transformFileSync(path.join(__dirname, '../frontend/app/contact/check_form.es6'), {
  presets: ['env']
}).code);

var utilities = eval(babel.transformFileSync(path.join(__dirname, '../frontend/app/lib/utilities.es6'), {
  presets: ['env']
}).code);

var checkFindForm = eval(babel.transformFileSync(path.join(__dirname, '../frontend/app/find/check_form.es6'), {
  presets: ['env']
}).code);

var transporter = nodemailer.createTransport('smtps://sport-chru@gmx.fr:Mm2ppBCsf@mail.gmx.com');

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
    title: config.title,
    id: "signin",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

// End route passport



// GET Method

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

router.get('/addArmoireReseau', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.render('addarmoirereseau', {
    title: config.title,
    id: "services",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/addLocalVdi', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || { error: false };
  var params = req.session.params || {};
  var user = req.user;
  res.render('addlocalvdi', {
    title: config.title,
    id: "services",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/addBatiment', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || { error: false };
  var params = req.session.params || {};
  var user = req.user;
  res.render('addbatiment', {
    title: config.title,
    id: "services",
    params: params,
    batiment: config.batiment,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/addBandeau', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || { error: false };
  var params = req.session.params || {};
  var user = req.user;
  res.render('addbandeaureseau', {
    title: config.title,
    id: "services",
    params: params,
    batiment: config.batiment,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/contact', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.render('contact', {
    title: config.title,
    id: "contact",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/createJson', function (req, res, next) {


  var refPrise = [];
  var prise = {};

  db.batiments.findAll({
    include: [{
      model: db.locauxvdis,
      include: [
        {
          model: db.armoiresreseaux,
          include: [{
            model: db.bandeauxreseaux
          }]
        }
      ]
    }],
    order:[
      ['nombatiment', 'DESC']
    ]}).then(batiments =>{
      var i = 0;
      for (batiment in batiments){
        for (local in batiments[batiment].locauxvdis){
          for (var armoire=1; armoire < batiments[batiment].locauxvdis[local].nbarmoire; ++armoire){
            var charEtage;
            if (batiments[batiment].locauxvdis[local].etage < 0){
              charEtage = utilities.convertirChiffreLettreEtage(batiments[batiment].locauxvdis[local].etage)
            } else charEtage = batiments[batiment].locauxvdis[local].etage;
            prise.name = batiments[batiment].caractbatiment + charEtage
              + utilities.caractereAile(batiments[batiment].caractbatiment, batiments[batiment].locauxvdis[local].aile) + '-' + armoire;
            refPrise[i] = prise;
            prise = {};
            ++i;
          }
        }
      }
    res.json({
      refPrise
    });
  }).catch(function (err) {
    // handle error;
    console.log(err);
    res.send({
      error: err.message
    })
  });

});

router.get('/find', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.render('find', {
    title: config.title,
    id: "find",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});


// POST Method

router.post('/contact', function(req, res, next) {
  // Check form fields
  var errors = checkContactForm(req.body);
  if (Object.keys(errors).length) {
    req.session.params = req.body;
    req.session.errors = errors;
    return res.redirect('/contact');
  }

  // Check recaptcha
  if (req.recaptcha.error) {
    if (req.xhr) {
      return res.json({ error: 'ReCaptcha Invalide.' });
    }
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/contact');
  }

  // Send email asynchronously. This way the user won't have to wait.

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: config.company.replyEmail,
    to:   config.company.email,
    subject: req.body.name + " vous a envoyé un message",
    html: ("<a href='mailto:" + req.body.email + "'>" + req.body.name + "</a> ( Message ) :\n\n" + req.body.message).replace(/\n/g, '<br />')
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      return console.log(error);
    }
  });

  // Ajax request
  var message = 'Votre message a bien ete envoyé.';
  if (req.xhr) {
    return res.json({ message: message });
  }

  // HTML request
  req.session.success = message;
  return res.redirect('/contact');
});



module.exports = router;