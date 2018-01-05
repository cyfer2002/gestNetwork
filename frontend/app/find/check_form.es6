
var REG_PRISE = /^[a-z][a-z0-9]{2}[-\/][a-z0-9][-\/][a-z0-9]{1,2}([-\/][a-z0-9])?$/i;


export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.prise.trim()) {
    errors.prise = 'Ce champ est requis';
  } else if (!REG_PRISE.test(inputs.prise)) {
    errors.prise = 'Numéro de prise non-valide';
  }
  return errors;
}
