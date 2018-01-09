import 'babel-polyfill';

// Expose jQuery globally with webpack
import $ from 'expose-loader?$!expose-loader?jQuery!jquery';

// Bootstrap
import 'bootstrap';
import './config/bootstrap.config.scss';

// Font-awesome
import 'font-awesome-webpack-2!./config/font-awesome.config.js';
import './config/font-awesome.config.less';

import './application.styl';

import ArmoiresForm from './app/armoiresReseaux/armoires_form';
import BandeauxForm from './app/bandeauxReseaux/bandeaux_form';
import ContactForm from './app/contact/contact_form';
import LoginForm from './app/login/login_form';
import LocauxVdisForm from './app/locauxVdis/vdis_form';
import FindForm from './app/find/find_form';
import BatimentsForm from './app/batiments/batiments_form';

$(() => {
  new ArmoiresForm($('.armoires-form form'));
  new BandeauxForm($('.bandeaux-form form'));
  new ContactForm($('.contact-form form'));
  new LoginForm($('.login-form form'));
  new LocauxVdisForm($('.vdis-form form'));
  new FindForm($('.find-form form'));
  new BatimentsForm($('.batiments-form form'));

  // Menu
  $('.navbar').on('click', ' .dropdown-menu a', () => {
    $('.navbar-collapse').removeClass('in');
  });
});