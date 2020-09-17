cordova.define("cordova-plugin-pm80-scanner.PM80Scanner", function (require, exports, module) {
  var exec = cordova.require("cordova/exec");

  /**
   * Constructor.
   *
   * @returns {Pm80Scanner}
   */
  function Pm80Scanner() {
  }

  /**
   * Read code from scanner.
   *
   * @param {Function} successCallback
   * @param {Function} errorCallback
   * @param config
   */
  Pm80Scanner.prototype.scan = function (successCallback, errorCallback, config) {
    if (successCallback != null) {
      pm80Scanner.set(successCallback, errorCallback);
    }
    exec(null, null, 'PM80Scanner', "scan2", null);
  };

  /**
   * Cancel.
   */
  Pm80Scanner.prototype.cancel = function () {
    exec(null, null, 'PM80Scanner', 'cancel', null);
  };

  /**
   * Beep.
   */
  Pm80Scanner.prototype.beep = function (mode) {
    exec(null, null, 'PM80Scanner', 'beep', [mode ? 1 : 0]);
  };

  /**
   * Register Callback.
   */
  Pm80Scanner.prototype.set = function (successCallback, errorCallback) {
    exec(
      function (resultObj) {
        try {
          successCallback(resultObj.result, resultObj);
        } catch (err) { }
        pm80Scanner.set(successCallback, errorCallback);
      }
      , function (error) {
        try {
          errorCallback(error);
        } catch (err) { }
        pm80Scanner.set(successCallback, errorCallback);
      }, 'PM80Scanner', 'set', null);
  };

  /**
   * Set Trigger Mode.
   */
  Pm80Scanner.prototype.setTriggerMode = function (mode) {
    if (mode == pm80Scanner.TRIGGER_MODE.ONESHOT || mode == pm80Scanner.TRIGGER_MODE.AUTO || mode == pm80Scanner.TRIGGER_MODE.CONTINUOUS) {
      exec(null, null, 'PM80Scanner', 'triggerMode', [mode]);
    }
  };

  /**
   * Set Scan Mode.
   */
  Pm80Scanner.prototype.setScanMode = function (mode) {
    if (mode == pm80Scanner.SCAN_MODE.USER_MSG || mode == pm80Scanner.SCAN_MODE.KEYBOARD_MSG || mode == pm80Scanner.SCAN_MODE.CLIPBOARD || mode == pm80Scanner.SCAN_MODE.EVENT) {
      exec(null, null, 'PM80Scanner', 'scanMode', [mode]);
    }
  };

  Pm80Scanner.prototype.TRIGGER_MODE = {
    ONESHOT: 0
    , AUTO: 1
    , CONTINUOUS: 2
  };

  Pm80Scanner.prototype.SCAN_MODE = {
    USER_MSG: 0
    , KEYBOARD_MSG: 1
    , CLIPBOARD: 2
    , EVENT: 3
  };

  var pm80Scanner = new Pm80Scanner();
  module.exports = pm80Scanner;

});
