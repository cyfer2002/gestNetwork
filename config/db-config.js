var Sequelize = require('sequelize');

// db config
var env = process.env.NODE_ENV || 'development';
const config = require('./config').db[env];


//var password = config.password ? config.password : null;

// initialize database connection
var sequelize = new Sequelize(
  config.database,
  config.user,
  config.password, {
    host : config.host,
    dialect: config.driver,
    logging: console.log,// permet de voir les logs de sequelize
    define: {
      timestamps: false
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('./models/users.js')(sequelize, Sequelize);
db.batiments = require('./models/batiments.js')(sequelize, Sequelize);
db.locauxvdis = require('./models/locauxVdis.js')(sequelize, Sequelize);
db.armoiresreseaux = require('./models/armoiresReseaux.js')(sequelize, Sequelize);
db.bandeauxreseaux = require('./models/bandeauxReseaux.js')(sequelize, Sequelize);
db.prisesreseaux = require('./models/prisesReseaux.js')(sequelize, Sequelize);

db.pilesswitchs = require('./models/pilesSwitchs.js')(sequelize, Sequelize);
db.slots = require('./models/slots.js')(sequelize, Sequelize);
db.switchs = require('./models/switchs.js')(sequelize, Sequelize);
db.portsreseaux = require('./models/portsReseaux.js')(sequelize, Sequelize);

//Relations
db.batiments.hasMany(db.locauxvdis, {foreignKey: 'batimentid'});
db.locauxvdis.hasMany(db.armoiresreseaux, {foreignKey: 'localvdiid'});
db.armoiresreseaux.hasMany(db.bandeauxreseaux, {foreignKey: 'armoireid'});
db.armoiresreseaux.hasMany(db.pilesswitchs, {foreignKey: 'armoireid'});
db.bandeauxreseaux.hasMany(db.prisesreseaux, {foreignKey: 'bandeauid'});
db.pilesswitchs.hasMany(db.slots, {foreignKey: 'nompile'});
db.slots.hasMany(db.switchs, {foreignKey: 'slotid'});
db.switchs.hasMany(db.portsreseaux, {foreignKey: 'switchid'});
db.prisesreseaux.hasOne(db.portsreseaux, {foreignKey: 'priseid'});


sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function(err) {
    console.log('Unable to connect to the database:', err);
  });

sequelize
  .sync({
  })
  .then(function(err) {
  }, function(err) {
    console.log('An error occurred while creating the table:', err);
  });

module.exports = db;