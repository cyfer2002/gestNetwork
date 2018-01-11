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
    "host": "192.168.129.130",
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

config.batiment = {
  etageSupMax: 9,
  etageInfMax: 3,
  aileMax: 4
};

config.aile = {
  '1': 'Nord',
  '2': 'Sud',
  '3': 'Est',
  '4': 'Ouest',
  '5': 'Central'
}

module.exports = config;