
import checkForm from './check_form';
import Flash from '../lib/flash';

var config = require('../../../config/config');

const ERROR_CLASS = 'has-danger';

export default class LocauxVdisForm {
  constructor(form) {
    this.$form = $(form);
    this.$batiment = {};
    if (!this.$form.length) return;

    this.$inputs = 'batimentid etage aile nbarmoire description'.split(' ').reduce((h, inputName) => {
      h[inputName] = this.$form.find(`[name="${inputName}"]`);
      return h;
    }, {});

    this.$form.find('.message-sent, .message-error').delay(5000).fadeOut(400);
    this.$form.on('submit', (e) => this.onSubmit(e));

    this.$form.find('select[name="batimentid"]').on('change', (e) => this.onChangeBatiment(e));

    this.onLoad();
  }

  get inputValues() {
    var values = {};
    for (var inputName in this.$inputs) {
      values[inputName] = this.$inputs[inputName].val();
    }
    return values;
  }

  resetErrors() {
    this.$form
      .find('.form-group').removeClass(ERROR_CLASS).end()
      .find('.form-control').removeClass('is-invalid').end()
      .find('.text-danger').remove();
  }

  onSubmit(e) {
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();

    // Check if user filled the form correctly
    var errors = checkForm(this.inputValues);

    // Error found
    if (Object.keys(errors).length) {
      // Display errors
      for (var inputName in errors) {
        this.displayInputError(inputName, errors[inputName]);
      }
      // Give focus to the first input with an error
      return this.$form.find('.has-danger:first').find('input,select,textarea').focus();
    }

    // Display spinner
    var $button = this.$form.find('[type="submit"]').prop('disabled', true);
    
    // Ajax call
    $.ajax({
      url:      this.$form.attr('action'),
      method:   this.$form.attr('method'),
      data:     this.$form.serialize(),
      dataType: 'JSON',
      success: (data) => {
        if (data.error) {
          Flash.danger(data.error, this.$form);
        }
        if (data.message) {
          Flash.success(data.message, this.$form);
          this.$form[0].reset();
          this.onLoad();
        }
      },
      complete: () => {
        $button.prop('disabled', false);
      }
    });
  }

  onLoad() {
    // Remove errors from previous submit call
    this.resetErrors();

    // Stop submit event
    var $select = this.$form.find('select[name="batimentid"]');
    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');

    $etage.prop('disabled', true);
    $aile.prop('disabled', true);
    $etage.children('option:not(:first)').remove();
    $aile.children('option:not(:first)').remove();
    $select.children('option:not(:first)').remove();
    $select.prop('disabled', false);

    // Ajax call
    $.ajax({
      url:      '/batiments/',
      method:   'GET',
      dataType: 'JSON',
      success: (data) => {
        if (data.error) {
          Flash.danger(data.error, this.$form);
        }
        if (data.message) {
          // Ce qu'il faut faire quand les données sont récupérées
          this.$batiment = data.message;
          for (var batiment in this.$batiment) {
            $select.append(new Option(this.$batiment[batiment].nombatiment, this.$batiment[batiment].batimentid, false, false));
          }
        }
      }
    });
  }

  onChangeBatiment(e) {
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();

    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');

    $etage.prop('disabled', true);
    $aile.prop('disabled', true);
    $etage.children('option:not(:first)').remove();
    $aile.children('option:not(:first)').remove();

    if (this.$form.find('select[name="batimentid"]').val()) {
      $etage.prop('disabled', false);
      $aile.prop('disabled', false);
      for (var batiment in this.$batiment) {
        if (this.$batiment[batiment].batimentid == this.$form.find('select[name="batimentid"]').val()) {
          for (var etage = this.$batiment[batiment].nbetageinf; etage > 0; --etage) {
            $etage.append(new Option(-etage, -etage, false, false));
          }
          for (var etage = 0; etage < this.$batiment[batiment].nbetagesup + 1; ++etage) {
            $etage.append(new Option(etage, etage, false, false));
          }
          for (var aile = 1; aile < this.$batiment[batiment].nbaile + 1; ++aile) {
            $aile.append(new Option(config.aile[aile], aile, false, false));
          }
        }
      }
    }
  }

  displayInputError(inputName, error) {
    this.$inputs[inputName]
      .closest('.form-group').addClass(ERROR_CLASS).end()       // Add class on form-group element
      .closest('.form-control').addClass('is-invalid').end()
      .after($('<small>', { class: 'text-danger' }).text(error)); // Add an help-block element with the error desc
  }

  convertirChiffreLettreEtage (chiffre) {
    return String.fromCharCode(chiffre+64);
  }
}