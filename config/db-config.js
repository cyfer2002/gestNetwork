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
db.user = require('./models/users.js')(sequelize, Sequelize);

//Relations
//db.user.hasMany(db.entries, {foreignKey: 'usertable_id'});

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