var REG_CHAR = /^[a-z]$/i;
var REG_NBETAGESUP = /^[0-9]$/i;
var REG_NBETAGEINF = /^[0-3]$/i;
var REG_NBAILE = /^[1-4]$/i;

export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.nombatiment.trim()) {
    errors.nombatiment = 'Ce champ est requis';
  }
  if (!inputs.caractbatiment.trim()) {
    errors.caractbatiment = 'Ce champ est requis';
  }else if (!REG_CHAR.test(inputs.caractbatiment)) {
    errors.caractbatiment = 'Caractère non-valide';
  }
  if (!inputs.nbetageinf.trim()) {
    errors.nbetageinf = 'Ce champ est requis';
  }else if (!REG_NBETAGEINF.test(inputs.nbetageinf)) {
    errors.nbetageinf = "Nombre d'étage non-valide, chiffre entre 0 et 3";
  }
  if (!inputs.nbetagesup.trim()) {
    errors.nbetagesup = 'Ce champ est requis';
  }else if (!REG_NBETAGESUP.test(inputs.nbetagesup)) {
    errors.nbetagesup = "Nombre d'étage non-valide, chiffre entre 0 et 9";
  }
  if (!inputs.nbaile.trim()) {
    errors.nbaile = 'Ce champ est requis';
  }else if (!REG_NBAILE.test(inputs.nbaile)) {
    errors.nbaile = "Nombre d'aile non-valide, minimum 1, maximum 4";
  }
  return errors;
}
