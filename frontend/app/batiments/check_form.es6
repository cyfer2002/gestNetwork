
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.nombatiment.trim()) {
    errors.nombatiment = 'Ce champ est requis';
  }
  if (!inputs.nbetageinf.trim()) {
    errors.nbetageinf = 'Ce champ est requis';
  }
  if (!inputs.nbetagesup.trim()) {
    errors.nbetagesup = 'Ce champ est requis';
  }
  if (!inputs.nbaile.trim()) {
    errors.nbaile = 'Ce champ est requis';
  }
  return errors;
}
