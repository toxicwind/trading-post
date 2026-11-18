'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionInterface = exports.Session = exports.SessionListResponse = exports.SessionGetResponse = exports.ValidateSessionResponse = exports.SessionResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _base = require('../base');

var _common = require('../utils/common.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var action = 'Verify/Session/';
var idField = 'session_uuid';
var actionKey = Symbol('api action');
var klassKey = Symbol('constructor');
var idKey = Symbol('id filed');
var clientKey = Symbol('make api call');

var SessionResponse = exports.SessionResponse = function SessionResponse(params) {
  _classCallCheck(this, SessionResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.message = params.message;
  this.sessionUuid = params.sessionUuid;
  if (params.invalidNumber != undefined) {
    this.invalid_number = params.invalidNumber;
  }
};

var ValidateSessionResponse = exports.ValidateSessionResponse = function ValidateSessionResponse(params) {
  _classCallCheck(this, ValidateSessionResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.message = params.message;
  if (params.invalidNumber != undefined) {
    this.invalid_number = params.invalidNumber;
  }
};

var SessionGetResponse = exports.SessionGetResponse = function SessionGetResponse(params) {
  _classCallCheck(this, SessionGetResponse);

  params = params || {};
  this.apiId = params.apiId;
  this.sessionUuid = params.sessionUuid;
  this.appUuid = params.appUuid;
  this.alias = params.alias;
  this.recipient = params.recipient;
  this.channel = params.channel;
  this.locale = params.locale;
  this.status = params.status;
  this.count = params.count;
  this.requestor_ip = params.requestorIp;
  this.destination_country_iso2 = params.destinationCountryIso2;
  this.destination_network = params.destinationNetwork;
  this.attemptDetails = params.attemptDetails;
  this.createdAt = params.createdAt;
  this.updatedAt = params.updatedAt;

  this.charges = Object.assign({}, params.charges);

  this.charges.totalCharge = params.charges.totalCharge;
  this.charges.validationCharge = params.charges.validationCharge;
  this.charges.attemptCharges = params.charges.attemptCharges;
};

var SessionListResponse = exports.SessionListResponse = function SessionListResponse(params) {
  _classCallCheck(this, SessionListResponse);

  params = params || {};
  this.sessionUuid = params.sessionUuid;
  this.appUuid = params.appUuid;
  this.recipient = params.recipient;
  this.alias = params.alias;
  this.channel = params.channel;
  this.locale = params.locale;
  this.status = params.status;
  this.count = params.count;
  this.requestor_ip = params.requestorIp;
  this.destination_country_iso2 = params.destinationCountryIso2;
  this.destination_network = params.destinationNetwork;
  this.attemptDetails = params.attemptDetails;
  this.createdAt = params.createdAt;
  this.updatedAt = params.updatedAt;

  this.charges = Object.assign({}, params.charges);

  this.charges.totalCharge = params.charges.totalCharge;
  this.charges.validationCharge = params.charges.validationCharge;
  this.charges.attemptCharges = params.charges.attemptCharges;
};

/**
 * Represents a Session
 * @constructor
 * @param {function} client - make api call
 * @param {object} [data] - data of call
 */


var Session = exports.Session = function (_PlivoResource) {
  _inherits(Session, _PlivoResource);

  function Session(client) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Session);

    var _this = _possibleConstructorReturn(this, (Session.__proto__ || Object.getPrototypeOf(Session)).call(this, action, Session, idField, client));

    _this[actionKey] = action;
    _this[clientKey] = client;
    if (idField in data) {
      _this.id = data[idField];
    };

    (0, _common.extend)(_this, data);
    return _this;
  }

  return Session;
}(_base.PlivoResource);

/**
 * Represents a Session Interface
 * @constructor
 * @param {function} client - make api call
 * @param {object} [data] - data of call
 */


var SessionInterface = exports.SessionInterface = function (_PlivoResourceInterfa) {
  _inherits(SessionInterface, _PlivoResourceInterfa);

  function SessionInterface(client) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SessionInterface);

    var _this2 = _possibleConstructorReturn(this, (SessionInterface.__proto__ || Object.getPrototypeOf(SessionInterface)).call(this, action, Session, idField, client));

    (0, _common.extend)(_this2, data);
    _this2[clientKey] = client;
    _this2[actionKey] = action;
    _this2[klassKey] = Session;
    _this2[idKey] = idField;
    return _this2;
  }

  /**
   * Send Session
   * @method
   * @param {Object} sessionReq- request body fields
   * @promise {object} return {@link PlivoGenericMessage} object if success
   * @fail {Error} return Error
   */


  _createClass(SessionInterface, [{
    key: 'create',
    value: function create(sessionReq) {

      var isObject = arguments.length;
      var app_uuid, recipient, url, method, channel, locale, brand_name, app_hash, code_length, dtmf, fraud_check;

      if (isObject === 1) {
        app_uuid = sessionReq.app_uuid;
        recipient = sessionReq.recipient;
        url = sessionReq.url;
        method = sessionReq.method;
        channel = sessionReq.channel;
        locale = sessionReq.locale;
        brand_name = sessionReq.brand_name;
        app_hash = sessionReq.app_hash;
        code_length = sessionReq.code_length;
        dtmf = sessionReq.dtmf;
        fraud_check = sessionReq.fraud_check;
      }

      var errors = (0, _common.validate)([{
        field: 'recipient',
        value: recipient,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var params = {};
      if (isObject === 1) {
        if (app_uuid) {
          params.app_uuid = app_uuid;
        }
        if (recipient) {
          params.recipient = recipient;
        }
        if (channel) {
          params.channel = channel;
        }
        if (locale) {
          params.locale = locale;
        }
        if (url) {
          params.url = url;
        }
        if (method) {
          params.method = method;
        }
        if (brand_name) {
          params.brand_name = brand_name;
        }
        if (app_hash) {
          params.app_hash = app_hash;
        }
        if (code_length) {
          params.code_length = code_length;
        }
        if (dtmf) {
          params.dtmf = dtmf;
        }
        if (fraud_check) {
          params.fraud_check = fraud_check;
        }
      }

      var client = this[clientKey];
      var idField = this[idKey];
      var action = this[actionKey] + (this.id ? this.id + '/' : '');

      return new Promise(function (resolve, reject) {
        client('POST', action, params).then(function (response) {
          resolve(new SessionResponse(response.body, idField));
        }).catch(function (error) {
          reject(error);
        });
      });
    }

    /**
     * Get Session by given id
     * @method
     * @param {string} id - id of session
     * @promise {object} return {@link Session} object if success
     * @fail {Error} return Error
     */

  }, {
    key: 'get',
    value: function get(id) {
      var _this3 = this;

      var errors = (0, _common.validate)([{
        field: 'id',
        value: id,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var client = this[clientKey];
      var action = this[actionKey];

      return new Promise(function (resolve, reject) {
        if (action !== '' && !id) {
          reject(new Error(_this3[idKey] + ' must be set'));
        }
        client('GET', action + (id ? id + '/' : '')).then(function (response) {
          resolve(new SessionGetResponse(response.body, client));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'list',
    value: function list(params) {
      var client = this[clientKey];
      var action = this[actionKey];
      return new Promise(function (resolve, reject) {
        client('GET', action, params).then(function (response) {
          var sessions = {
            api_id: response.body.apiId,
            meta: response.body.meta
          };
          var objects = [];
          Object.defineProperty(objects, 'meta', {
            value: response.body.meta,
            enumerable: true
          });
          Object.defineProperty(objects, 'apiId', {
            value: response.body.apiId,
            enumerable: true
          });
          if (response.body.sessions !== null) {
            response.body.sessions.forEach(function (item) {
              objects.push(new SessionListResponse(item, client));
            });
            sessions.sessions = objects;
          } else {
            sessions.sessions = null;
          }
          resolve(sessions);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'validate',
    value: function validate(req) {
      var id, otp;
      var isObject = arguments.length;
      if (isObject === 1) {
        id = req.id;
        otp = req.otp;
      }
      var errors = (0, _common.validate)([{
        field: 'id',
        value: id,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      errors = (0, _common.validate)([{
        field: 'otp',
        value: otp,
        validators: ['isRequired']
      }]);

      if (errors) {
        return errors;
      }

      var params = {};
      params.otp = otp;

      var client = this[clientKey];
      var idField = this[idKey];
      var action = this[actionKey];

      return new Promise(function (resolve, reject) {
        client('POST', action + (id ? id + '/' : ''), params).then(function (response) {
          resolve(new ValidateSessionResponse(response.body, idField));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }]);

  return SessionInterface;
}(_base.PlivoResourceInterface);