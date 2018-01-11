export default class Utilities {
  constructor() {
  }
  static caractereAile (caractBatiment, numAile){
    var char;

    if ((caractBatiment == 'M') || (caractBatiment == 'Z')) {
      char = config.aile[numAile].substring(0,1);
    }
    else char = numAile;
    return char;
  }

  static convertirChiffreLettreEtage (chiffre){
    return String.fromCharCode((-chiffre)+64);
  }

  static convertirLettreChiffreEtage(lettre){
    return (lettre.charCodeAt(0)-64);
  }

  static convertirLettreChiffreAile(lettre){
    var aile;
    switch(lettre) {
      case 'N':
        return 1;
        break;
      case 'S':
        aile = 2;
        break;
      case 'E':
        aile = 3;
        break;
      case 'O':
        aile = 4;
        break;
      case 'C':
        aile = 5;
        break;
    }
    return (aile);
  }
}