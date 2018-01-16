
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.batimentid.trim()) {
    errors.batimentid = 'Ce champ est requis';
  }
  if (!inputs.etage.trim()) {
    errors.etage = 'Ce champ est requis';
  }
  if (!inputs.aile.trim()) {
    errors.aile = 'Ce champ est requis';
  }
  if (!inputs.armoireid.trim()) {
    errors.armoireid = 'Ce champ est requis';
  }
  return errors;
}
