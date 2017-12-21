
const ALERT_TYPES = ["success", "info", "warning", "danger"];

export default class Flash {
  static element(parent) {
    let $parent = $(parent);
    return $parent.length ? $parent : $('body .container:first');
  }

  static _display(type, message, parent) {
    let html = `
      <div class="alert fade in alert-${type}">
        <button class="close" data-dismiss="alert" type="button">×</button>
        ${message}
      </div>`;
    (parent ? $(parent) : this.element()).prepend($(html).delay(5000).fadeOut(400));
  }
}

ALERT_TYPES.forEach((type) => {
  Flash[type] = function(message, parent) {
    this._display(type, message, parent);
  }
});