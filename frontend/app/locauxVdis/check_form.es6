
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.etage.trim()) {
    errors.etage = 'Ce champ est requis';
  }
  if (!inputs.aile.trim()) {
    errors.aile = 'Ce champ est requis';
  }
  if (!inputs.nbarmoire.trim()) {
    errors.nbarmoire = 'Ce champ est requis';
  }
  if (!inputs.description.trim()) {
    errors.description = 'Ce champ est requis';
  }
  return errors;
}
