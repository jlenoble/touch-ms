'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passFile = function passFile(file) {
  return new Promise(function (resolve, reject) {
    _fs2.default.stat(file, function (err, stats) {
      if (err) {
        return reject(err);
      }
      if (!stats.isFile()) {
        var _err = new TypeError(file + ' is not a file');
        _err.file = file;
        return reject(_err);
      }
      resolve({ file: file, stats: stats });
    });
  });
};

var openFile = function openFile(_ref) {
  var file = _ref.file;

  return new Promise(function (resolve, reject) {
    _fs2.default.open(file, 'r+', function (err, fd) {
      if (err) {
        if (fd) {
          err.fd = fd; // eslint-disable-line no-param-reassign
        }
        return reject(err);
      }
      resolve(fd);
    });
  });
};

var closeFile = function closeFile(fd) {
  return new Promise(function (resolve, reject) {
    _fs2.default.close(fd, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

var touchFile = function touchFile(fd) {
  return new Promise(function (resolve, reject) {
    var date = new Date();
    _fs2.default.futimes(fd, date, date, function (err) {
      if (err) {
        err.fd = fd; // eslint-disable-line no-param-reassign
        return reject(err);
      }
      resolve(fd);
    });
  });
};

var returnStats = function returnStats(file) {
  return function () {
    return passFile(file);
  };
};

var onError = function onError(err) {
  throw err;
};

var onPassError = onError;
var onOpenError = onError;
var onTouchError = onError;
var onCloseError = function onCloseError(err) {
  if (err.fd) {
    return closeFile(err.fd);
  }
  if (err.file) {
    return err.file;
  }
  throw err;
};

var touchMs = function touchMs(file) {
  return Promise.resolve(file).then(passFile).then(openFile, onPassError).then(touchFile, onOpenError).then(closeFile, onTouchError).then(returnStats(file), onCloseError);
};

exports.default = touchMs;
module.exports = exports['default'];