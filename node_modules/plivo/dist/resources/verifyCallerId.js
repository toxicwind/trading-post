'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyInterface = exports.Verify = exports.ListVerifiedCallerIdResponse = exports.GetVerifiedCallerIdResponse = exports.VerifyCallerIdResponse = exports.InitiateVerifyResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _base = require('../base');

var _common = require('../utils/common.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientKey = Symbol();
var action = 'VerifiedCallerId/';
var idField = 'verificationUuid';

var InitiateVerifyResponse = exports.InitiateVerifyResponse = function InitiateVerifyResponse(params) {
  _classCallCheck(this, InitiateVerifyResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.message = params.message;
  this.verificationUuid = params.verificationUuid;
};

var VerifyCallerIdResponse = exports.VerifyCallerIdResponse = function VerifyCallerIdResponse(params) {
  _classCallCheck(this, VerifyCallerIdResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.alias = params.alias;
  this.channel = params.channel;
  this.country = params.country;
  this.createdAt = params.createdAt;
  this.phoneNumber = params.phoneNumber;
  this.subaccount = params.subaccount;
  this.verificationUuid = params.verificationUuid;
};

var GetVerifiedCallerIdResponse = exports.GetVerifiedCallerIdResponse = function GetVerifiedCallerIdResponse(params) {
  _classCallCheck(this, GetVerifiedCallerIdResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.alias = params.alias;
  this.country = params.country;
  this.createdAt = params.createdAt;
  this.modifiedAt = params.modifiedAt;
  this.phoneNumber = params.phoneNumber;
  this.subaccount = params.subaccount;
  this.verificationUuid = params.verificationUuid;
};

var ListVerifiedCallerIdResponse = exports.ListVerifiedCallerIdResponse = function ListVerifiedCallerIdResponse(params) {
  _classCallCheck(this, ListVerifiedCallerIdResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.meta = params.meta;
  this.objects = params.objects;
};

/**
 * Represents a Verify
 * @constructor
 * @param {function} client - make verify api call
 * @param {object} [data] - data of verify
 */

var Verify = exports.Verify = function (_PlivoResource) {
  _inherits(Verify, _PlivoResource);

  function Verify(client) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Verify);

    var _this = _possibleConstructorReturn(this, (Verify.__proto__ || Object.getPrototypeOf(Verify)).call(this, action, Verify, idField, client));

    _this[clientKey] = client;
    if (idField in data) {
      _this.id = data[idField];
    }
    (0, _common.extend)(_this, data);
    return _this;
  }

  return Verify;
}(_base.PlivoResource);

var VerifyInterface = exports.VerifyInterface = function (_PlivoResourceInterfa) {
  _inherits(VerifyInterface, _PlivoResourceInterfa);

  function VerifyInterface(client) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, VerifyInterface);

    var _this2 = _possibleConstructorReturn(this, (VerifyInterface.__proto__ || Object.getPrototypeOf(VerifyInterface)).call(this, action, Verify, client));

    _this2[clientKey] = client;
    if (idField in data) {
      _this2.id = data[idField];
    }
    (0, _common.extend)(_this2, data);
    return _this2;
  }

  _createClass(VerifyInterface, [{
    key: 'initiate',
    value: function initiate(phoneNumber) {
      var optionalParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var errors = (0, _common.validate)([{
        field: 'phoneNumber',
        value: phoneNumber,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      optionalParams.phoneNumber = phoneNumber;

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('POST', action, optionalParams).then(function (response) {
          resolve(new InitiateVerifyResponse(response.body));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'verify',
    value: function verify(verificationUuid, otp) {

      var errors = (0, _common.validate)([{
        field: 'verificationUuid',
        value: verificationUuid,
        validators: ['isRequired']
      }, {
        field: 'otp',
        value: otp,
        validators: ['isRequired']
      }]);
      var params = {};
      params.otp = otp;

      if (errors) {
        return errors;
      }

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('POST', action + 'Verification/' + verificationUuid, params).then(function (response) {
          resolve(new VerifyCallerIdResponse(response.body));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'updateVerifiedCallerId',
    value: function updateVerifiedCallerId(phoneNumber) {
      var optionalParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      var errors = (0, _common.validate)([{
        field: 'phoneNumber',
        value: phoneNumber,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('POST', action + phoneNumber + '/', optionalParams).then(function (response) {
          resolve(new GetVerifiedCallerIdResponse(response.body));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'getVerifiedCallerId',
    value: function getVerifiedCallerId(phoneNumber) {

      var errors = (0, _common.validate)([{
        field: 'phoneNumber',
        value: phoneNumber,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('GET', action + phoneNumber + '/').then(function (response) {
          resolve(new GetVerifiedCallerIdResponse(response.body));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'listVerifiedCallerId',
    value: function listVerifiedCallerId() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('GET', action, params).then(function (response) {
          resolve(new ListVerifiedCallerIdResponse(response.body));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'deleteVerifiedCallerId',
    value: function deleteVerifiedCallerId(phoneNumber) {

      var errors = (0, _common.validate)([{
        field: 'phoneNumber',
        value: phoneNumber,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var client = this[clientKey];

      return new Promise(function (resolve, reject) {
        client('DELETE', action + phoneNumber + '/').then(function () {
          resolve(true);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }]);

  return VerifyInterface;
}(_base.PlivoResourceInterface);