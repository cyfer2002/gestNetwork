import 'babel-polyfill';

// Expose jQuery globally with webpack
import $ from 'expose-loader?$!expose-loader?jQuery!jquery';

// Bootstrap
import 'bootstrap-webpack!./config/bootstrap.config.js';
import './config/bootstrap.config.less';

// Font-awesome
import 'font-awesome-webpack-2!./config/font-awesome.config.js';
import './config/font-awesome.config.less';

import './application.styl';

import ContactForm from './app/contact/contact_form';
import GamersForm from './app/gamers/gamers_form';

$(() => {
  new ContactForm($('.contact-form form'));
  new GamersForm($('.gamers-form form'))

  // Menu
  $('.navbar').on('click', ' .dropdown-menu a', () => {
    $('.navbar-collapse').removeClass('in');
  });
});