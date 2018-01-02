var config = {};

config.title = "Gestion Réseau du CHRU";
config.company = {
  name:   "CHRU de Besançon",
  email:  "nvatin@chu-besancon.fr",
  phone: "(+33) 3 81 21 89 55"
};
config.company.replyEmail   =  config.company.name + " <sport-chru@gmx.fr>";

config.db = {
  production: {
    "driver": "mysql",// votre base de donnée (mysql…)
    "host": "eris",
    "user": "git",
    "database": "gestNetwork",
    "password": "Cd1m2ppG!"
  },
  development: {
    "driver": "postgres",// votre base de donnée (mysql…)
    "host": "localhost",
    "user": "badminton",
    "database": "gestNetwork",
    "password": "badminton"
  }
};

module.exports = config;