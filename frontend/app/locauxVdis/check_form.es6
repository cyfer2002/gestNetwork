var REG_NBARMOIRE = /^[1-9]$/i;

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
  if (!inputs.nbarmoire.trim()) {
    errors.nbarmoire = 'Ce champ est requis';
  }else if (!REG_NBARMOIRE.test(inputs.nbarmoire)) {
    errors.nbarmoire = "Nombre d'armoire non-valide, chiffre entre 1 et 9";
  }
  return errors;
}
