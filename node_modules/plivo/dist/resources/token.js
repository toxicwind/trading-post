'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TokenInterface = exports.CreateTokenResponse = undefined;

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
var action = 'JWT/Token/';

var CreateTokenResponse = exports.CreateTokenResponse = function CreateTokenResponse(params) {
    _classCallCheck(this, CreateTokenResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.token = params.token;
};

/**
 * Represents a Token Interface
 * @constructor
 * @param {function} client - make api Token
 * @param {object} [data] - data of Token
 */


var TokenInterface = exports.TokenInterface = function (_PlivoResourceInterfa) {
    _inherits(TokenInterface, _PlivoResourceInterfa);

    function TokenInterface(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TokenInterface);

        var _this = _possibleConstructorReturn(this, (TokenInterface.__proto__ || Object.getPrototypeOf(TokenInterface)).call(this, action, TokenInterface, client));

        (0, _common.extend)(_this, data);

        _this[clientKey] = client;
        return _this;
    }
    /**
     * Create a token
     * @method
     * @param {string} iss - Auth id of the user
     * @param {object} optionalParams - Optional Params to send message
     * @param {string} [optionalParams.sub] - subject of the token
     * @param {string} [optionalParams.exp] - expiration time of the token
     * @param {string} [optionalParams.nbf] - not before time of the token
     * @param {boolean} [optionalParams.incoming_allow] - incoming allow of the token
     * @param {boolean} [optionalParams.outgoing_allow] - outgoing allow of the token
     * @param {string} [optionalParams.app] - app id of the token
     * @param {json} [optionalParams.per] - permissions of the token
     * @promise {object} return {@link PlivoGenericMessage} object if success
     * @fail {Error} returns Error
     */


    _createClass(TokenInterface, [{
        key: 'create',
        value: function create(iss) {
            var optionalParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var errors = (0, _common.validate)([{
                field: 'iss',
                value: iss,
                validators: ['isRequired']
            }]);
            if (errors) {
                return errors;
            }

            var params = {};
            params.per = {};
            params.per.voice = {};
            if (optionalParams.sub) {
                params.sub = optionalParams.sub;
            }
            if (optionalParams.exp) {
                params.exp = optionalParams.exp;
            }
            if (optionalParams.nbf) {
                params.nbf = optionalParams.nbf;
            }
            if (optionalParams.incoming_allow) {
                params.per.voice.incoming_allow = optionalParams.incoming_allow;
            }
            if (optionalParams.outgoing_allow) {
                params.per.voice.outgoing_allow = optionalParams.outgoing_allow;
            }
            if (optionalParams.app) {
                params.app = optionalParams.app;
            }
            params.iss = iss;

            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('POST', action, params).then(function (response) {
                    resolve(new CreateTokenResponse(response.body));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }]);

    return TokenInterface;
}(_base.PlivoResourceInterface);