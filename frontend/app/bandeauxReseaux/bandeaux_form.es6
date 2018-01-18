
import checkInput from './check_form_input';
import checkForm from './check_form';
import Utilities from '../lib/utilities'

import Flash from '../lib/flash';

var config = require('../../../config/config');

const ERROR_CLASS = 'has-danger';

export default class BandeauxForm {
  constructor(form) {
    this.$form = $(form);
    this.$batiment = {};
    this.$vdis = {};
    if (!this.$form.length) return;

    this.$inputs = 'batimentid etage aile armoireid nbbandeau prise'.split(' ').reduce((h, inputName) => {
      h[inputName] = this.$form.find(`[name="${inputName}"]`);
      return h;
    }, {});
    $('secondPart').hide();
    this.$form.find('.message-sent, .message-error').delay(5000).fadeOut(400);
    this.$form.on('submit', (e) => this.onSubmit(e));

    this.$form.find('select[name="batimentid"]').on('change', (e) => this.onChangeBatiment(e));
    this.$form.find('select[name="etage"]').on('change', (e) => this.onChangeEtage(e));
    this.$form.find('select[name="aile"]').on('change', (e) => this.onChangeEtage(e));
    this.$form.find('select[name="armoireid"]').on('change', (e) => this.onChangeArmoire(e));

    this.$form.find('button[type="button"]').on('click', (e) => this.onClickButton(e));

    this.$form.find('input[name="prise"]').on('input', (e) => this.onInput(e));

    $('#optionList').on('change', (e) => this.onInput(e));

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


  onInput(e){
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();

    // Display spinner
    var $button = this.$form.find('[type="button"]').prop('disabled', true);

    //$('#list').children().remove();
    var errors = checkInput(this.inputValues);

    var $batiment = this.$form.find('select[name="batimentid"]');
    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');
    var $armoire= this.$form.find('select[name="armoireid"]');

    // Error found
    if (Object.keys(errors).length) {
      // Display errors
      for (var inputName in errors) {
        this.displayInputError(inputName, errors[inputName]);
      }
      // Give focus to the first input with an error
      this.$form.find('.has-danger:first').find('input,select,textarea').focus();
    }

    if ((this.$form.find('input[name="prise"]').val().length > 0) && ((this.$form.find('input[name="prise"]').val().length < 2))) {
      $etage.prop('disabled', true);
      $aile.prop('disabled', true);
      $armoire.prop('disabled', true);

      $etage.children('option:not(:first)').remove();
      $aile.children('option:not(:first)').remove();
      $batiment.children('option:not(:first)').remove();
      $armoire.children('option:not(:first)').remove();

      //$select.prop('disabled', false);

      // Ajax call
      $.ajax({
        url: '/batiments/char/' + (this.$form.find('input[name="prise"]').val()).substring(0, 1),
        method: 'GET',
        dataType: 'JSON',
        success: (data) => {
          if (data.error) {
            Flash.danger(data.error, this.$form);
          }
          if (data.message) {
            $batiment.append(new Option(data.message[0].nombatiment, data.message[0].batimentid, false, true));
          }
        },
        complete: () => {
          $button.prop('disabled', false);
        }
      });
    } else if (this.$form.find('input[name="prise"]').val().length > 1) {
        var etage, aile, armoire;
        var expr = /^[a-z]$/i ;
        var exprArmoire = /^[1-9a-z]$/i ;
        if (expr.test((this.$form.find('input[name="prise"]').val()).substring(1,2))){
          etage = - Utilities.convertirLettreChiffreEtage((this.$form.find('input[name="prise"]').val()).substring(1,2));
        } else etage =(this.$form.find('input[name="prise"]').val()).substring(1,2);
        // Ajax call
        if (expr.test((this.$form.find('input[name="prise"]').val()).substring(2,3))){
          aile = Utilities.convertirLettreChiffreAile((this.$form.find('input[name="prise"]').val()).substring(2,3));
        } else aile =(this.$form.find('input[name="prise"]').val()).substring(2,3);

        if (exprArmoire.test((this.$form.find('input[name="prise"]').val()).substring(3,4))){
          if (expr.test((this.$form.find('input[name="prise"]').val()).substring(3,4))){
            armoire = Utilities.convertirLettreChiffreEtage((this.$form.find('input[name="prise"]').val()).substring(3,4));
          } else armoire =(this.$form.find('input[name="prise"]').val()).substring(3,4);
        } else {
          if (expr.test((this.$form.find('input[name="prise"]').val()).substring(4,5))){
            armoire = Utilities.convertirLettreChiffreEtage((this.$form.find('input[name="prise"]').val()).substring(4,5));
          } else {
            armoire =(this.$form.find('input[name="prise"]').val()).substring(4,5);
          }
        }
        if (armoire) $button.prop('disabled', false);
        $armoire.append(new Option(armoire, armoire, false, true));
        $etage.append(new Option(etage, etage, false, true));
        $aile.append(new Option(config.aile[aile], aile, false, true));

      } else {
      this.onLoad();
      this.$form.find('input[name="prise"]').focus();
    }
  }

  onSubmit(e) {
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();

    // Check if user filled the form correctly
    var errors = checkForm(this.inputValues);
    this.$form.find('select[name="etage"]').prop('disabled', false);
    this.$form.find('select[name="aile"]').prop('disabled', false);
    this.$form.find('select[name="armoireid"]').prop('disabled', false);
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
//    let $armoire = this.$form.find('[name="armoireid"]');
//    alert('coucou' + this.$form.serialize());
    
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

    var options = {

      url: "/createJson",

      categories: [{
        listLocation: "refPrise",
        maxNumberOfElements: 8
      }],

      getValue: function(element) {
        return element.name;
      },

      list: {
        match: {
          enabled: true
        }
      },

      theme: "plate-dark"
    };

    $('#optionList').easyAutocomplete(options);

    // Stop submit event
    var $select = this.$form.find('select[name="batimentid"]');
    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');
    this.$form.find('[type="submit"]').prop('disabled', true);

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

  onChangeEtage(e){
    // Stop submit event
    e.preventDefault();

    var $armoire = this.$form.find('select[name="armoireid"]');
    $armoire.prop('disabled', true);

    if ((this.$form.find('select[name="etage"]').val()) && (this.$form.find('select[name="aile"]').val())) {
      this.selectionArmoire(e);
    }
  }

  onClickButton(e){
    // Stop submit event
    e.preventDefault();
    this.$form.find('[type="submit"]').prop('disabled', false);

    $('firstPart').fadeOut(400);
    $('secondPart').delay(500).fadeIn(1000);

    var $select = this.$form.find('select[name="batimentid"]');
    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');
    var $armoire = this.$form.find('select[name="armoireid"]');

    $.ajax({
      url: '/locauxvdis/' + ($select.val()),
      method: 'GET',
      dataType: 'JSON',
      success: (data) => {
        if (data.error) {
          Flash.danger(data.error, this.$form);
        }
        if (data.message) {
          for (var local in data.message ){
            if((data.message[local].etage == $etage.val()) && (data.message[local].aile == $aile.val())){
              $.ajax({
                url: '/armoiresReseaux/localvdi/' + (data.message[local].localvdiid),
                method: 'GET',
                dataType: 'JSON',
                success: (result) => {
                  if (result.error) {
                    Flash.danger(data.error, this.$form);
                  }
                  if (result.message) {
                    for ( var numarmoire in data.message){
                      if (result.message[numarmoire].numeroarmoire == $armoire.val()) {
                        //$armoire.children('option:not(:first)').remove();
                        $armoire.append(new Option($armoire.val(), result.message[numarmoire].armoireid, false, true));
                      }
                    }
                  }
                }
              });
            }
          }
        }
      }
    });

  }

  onChangeArmoire(e){
    // Stop submit event
    e.preventDefault();

    var $armoire = this.$form.find('select[name="armoireid"]');
    var $button = this.$form.find('[type="button"]');
    $button.prop('disabled', true);

    if($armoire.val() != "") {
      $button.prop('disabled', false);
    }
  }

  selectionArmoire(e) {
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();


    // Display spinner
    var $button = this.$form.find('[type="button"]');

    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');
    var $armoire = this.$form.find('select[name="armoireid"]');

    var valetage = $etage.val();
    var valaile = $aile.val();
    $etage.prop('disabled', true);
    $aile.prop('disabled', true);
    $armoire.prop('disabled', true);
    $button.prop('disabled', true);


    $etage.children('option:not(:first)').remove();
    $aile.children('option:not(:first)').remove();
    $armoire.children('option:not(:first)').remove();

    if (this.$form.find('select[name="batimentid"]').val()) {
      $etage.prop('disabled', false);
      $aile.prop('disabled', false);
      $armoire.prop('disabled', false);

      $.ajax({
        url:      '/locauxVdis/' + this.$form.find('select[name="batimentid"]').val(),
        method:   'GET',
        dataType: 'JSON',
        success: (data) => {
          if (data.error) {
            Flash.danger(data.error, this.$form);
          }
          if (data.message) {
            // Ce qu'il faut faire quand les données sont récupérées
            this.$vdis = data.message;
            for (var batiment in this.$batiment) {
              if (this.$batiment[batiment].batimentid == this.$form.find('select[name="batimentid"]').val()) {
                for (var etage = this.$batiment[batiment].nbetageinf; etage > 0; --etage) {
                  if (etage == -valetage) {
                    $etage.append(new Option(-etage, -etage, false, true));
                  }
                  else $etage.append(new Option(-etage, -etage, false, false));
                }
                for (var etage = 0; etage < this.$batiment[batiment].nbetagesup + 1; ++etage) {
                  if (etage == valetage) {
                    $etage.append(new Option(etage, etage, false, true));
                  }
                  else $etage.append(new Option(etage, etage, false, false));
                }
                for (var aile = 1; aile < this.$batiment[batiment].nbaile + 1; ++aile) {
                  if (aile == valaile) {
                    $aile.append(new Option(config.aile[aile], aile, false, true));
                  }
                  else $aile.append(new Option(config.aile[aile], aile, false, false));
                }
                for (var local in this.$vdis) {
                  if((this.$vdis[local].etage == valetage) && (this.$vdis[local].aile == valaile)){
                    var nbarmoire = this.$vdis[local].nbarmoire;
                    $.ajax({
                      url:      '/armoiresReseaux/localvdi/' + this.$vdis[local].localvdiid,
                      method:   'GET',
                      dataType: 'JSON',
                      success: (data) => {
                        if (data.error) {
                          Flash.danger(data.error, this.$form);
                        }
                        if (data.message) {
                          for (var armoire in data.message){
                            if (nbarmoire == 1) {
                              $armoire.append(new Option(data.message[armoire].numeroarmoire, data.message[armoire].armoireid, false, true));
                              $button.prop('disabled', false);
                            }
                            else $armoire.append(new Option(data.message[armoire].numeroarmoire, data.message[armoire].armoireid, false, false));
                          }
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  onChangeBatiment(e) {
    // Stop submit event
    e.preventDefault();

    // Remove errors from previous submit call
    this.resetErrors();

    var $button = this.$form.find('[type="button"]')
    var $etage = this.$form.find('select[name="etage"]');
    var $aile = this.$form.find('select[name="aile"]');
    var $armoire = this.$form.find('select[name="armoireid"]');

    $button.prop('disabled', true);
    $etage.prop('disabled', true);
    $aile.prop('disabled', true);
    $armoire.prop('disabled', true);
    $etage.children('option:not(:first)').remove();
    $aile.children('option:not(:first)').remove();
    $armoire.children('option:not(:first)').remove();

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