
var REG_PRISE = /^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.prise.trim()) {
    errors.prise = 'Ce champ est requis';
  } else if (!REG_PRISE.test(inputs.email)) {
    errors.prise = 'Numéro de prise non-valide';
  }
  return errors;
}
