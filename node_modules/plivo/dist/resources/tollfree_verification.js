'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TollfreeVerificationInterface = exports.TollfreeVerification = exports.ListTollfreeVerificationResponse = exports.GetTollfreeVerificationResponse = exports.CreateTollfreeVerificationResponse = exports.UpdateTollfreeVerificationResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../base');

var _common = require('../utils/common.js');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientKey = Symbol();
var action = 'TollfreeVerification/';
var idField = 'uuid';

/**
 * Represents a TollFreeVerification Request
 * @constructor
 * @param {function} client - make  the request
 * @param {object} [data] - data of request
 */

var UpdateTollfreeVerificationResponse = exports.UpdateTollfreeVerificationResponse = function UpdateTollfreeVerificationResponse(params) {
    _classCallCheck(this, UpdateTollfreeVerificationResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.message = params.message;
};

var CreateTollfreeVerificationResponse = exports.CreateTollfreeVerificationResponse = function CreateTollfreeVerificationResponse(params) {
    _classCallCheck(this, CreateTollfreeVerificationResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.uuid = params.uuid;
    this.message = params.message;
};

var GetTollfreeVerificationResponse = exports.GetTollfreeVerificationResponse = function GetTollfreeVerificationResponse(params) {
    _classCallCheck(this, GetTollfreeVerificationResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.uuid = params.uuid;
    this.profile_uuid = params.profileUuid;
    this.number = params.number;
    this.usecase = params.usecase;
    this.usecase_summary = params.usecaseSummary;
    this.message_sample = params.messageSample;
    this.optin_image_url = params.optinImageUrl;
    this.optin_type = params.optinType;
    this.volume = params.volume;
    this.additional_information = params.additionalInformation;
    this.extra_data = params.extraData;
    this.callback_url = params.callbackUrl;
    this.callback_method = params.callbackMethod;
    this.status = params.status;
    this.error_message = params.errorMessage;
    this.created = params.created;
    this.last_modified = params.lastModified;
};

var ListTollfreeVerificationResponse = exports.ListTollfreeVerificationResponse = function ListTollfreeVerificationResponse(params) {
    _classCallCheck(this, ListTollfreeVerificationResponse);

    params = params || {};
    this.uuid = params.uuid;
    this.profile_uuid = params.profileUuid;
    this.number = params.number;
    this.usecase = params.usecase;
    this.usecase_summary = params.usecaseSummary;
    this.message_sample = params.messageSample;
    this.optin_image_url = params.optinImageUrl;
    this.optin_type = params.optinType;
    this.volume = params.volume;
    this.additional_information = params.additionalInformation;
    this.extra_data = params.extraData;
    this.callback_url = params.callbackUrl;
    this.callback_method = params.callbackMethod;
    this.status = params.status;
    this.error_message = params.errorMessage;
    this.created = params.created;
    this.last_modified = params.lastModified;
};

var TollfreeVerification = exports.TollfreeVerification = function (_PlivoResource) {
    _inherits(TollfreeVerification, _PlivoResource);

    function TollfreeVerification(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TollfreeVerification);

        var _this = _possibleConstructorReturn(this, (TollfreeVerification.__proto__ || Object.getPrototypeOf(TollfreeVerification)).call(this, action, TollfreeVerification, idField, client));

        if (idField in data) {
            _this.id = data[idField];
        }
        _this[clientKey] = client;
        (0, _common.extend)(_this, data);
        return _this;
    }

    /**
     * update TollfreeVerification request
     * @method
     * @param {object} params - to update TollfreeVerification request
     * @param {string} [params.profile_uuid] - The unique identifier of an existing Plivo profile. 
     * @param {string} [params.usecase] - The messaging usecase(s) for which the TF should be used for. One is mandatory, others can be added with comma separation
     * @param {string} [params.usecase_summary] - The explanation on how messaging is used on this toll-free phone number by the business or organization. Max character limit = 500.
     * @param {string} [params.message_sample] - Sample message(s) that the end-business will be sending to the end-user/mobile handset. Max character limit = 1000.
     * @param {string} [params.opt_in_image_url] - A valid url where the customer submits images explaining details of the opt-in process for the end user. Multiple urls allowed with comma separation 
     * @param {string} [params.opt_in_type] - Describes how a user opts-in to text messages.
     * @param {string} [params.volume] - The monthly volume estimation of messages from the Toll-Free Number.
     * @param {string} [params.additional_information] - Any additional information related to the website. Max character limit = 500.
     * @param {string} [params.extra_data] - Any extra information which the customer would like to pass for internal references. 
     * @param {string} [params.callback_url] - A valid URL where verification relatated callbacks will be sent. 
     * @param {string} [params.callback_method] - Valid Input: GET, POST
     * @promise {object} return {@link UpdateTollfreeVerificationResponse} object
     * @fail {Error} return Error
     */


    _createClass(TollfreeVerification, [{
        key: 'update',
        value: function update(params) {
            var _this2 = this;

            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('POST', action + _this2.id + '/', params).then(function (response) {
                    (0, _common.extend)(_this2, params);
                    resolve(new UpdateTollfreeVerificationResponse(response.body));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * delete TollfreeVerification request
         * @method
         * @promise {object} return true on success
         * @fail {Error} return Error
         */

    }, {
        key: 'delete',
        value: function _delete() {
            var _this3 = this;

            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('DELETE', action + _this3.id + '/').then(function () {
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }]);

    return TollfreeVerification;
}(_base.PlivoResource);

/**
 * Represents a TollfreeVerification request interface
 * @constructor
 * @param {function} client - make API call
 * @param {object} [data] - data of the API call
 */


var TollfreeVerificationInterface = exports.TollfreeVerificationInterface = function (_PlivoResourceInterfa) {
    _inherits(TollfreeVerificationInterface, _PlivoResourceInterfa);

    function TollfreeVerificationInterface(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TollfreeVerificationInterface);

        var _this4 = _possibleConstructorReturn(this, (TollfreeVerificationInterface.__proto__ || Object.getPrototypeOf(TollfreeVerificationInterface)).call(this, action, TollfreeVerification, idField, client));

        (0, _common.extend)(_this4, data);
        _this4[clientKey] = client;
        return _this4;
    }

    /**
     * get TollfreeVerification request by uuid
     * @method
     * @param {string} uuid - uuid of TollfreeVerification request
     * @promise {object} return {@link TollfreeVerification} object
     * @fail {Error} return Error
     */


    _createClass(TollfreeVerificationInterface, [{
        key: 'get',
        value: function get(uuid) {
            var params = {};
            var client = this[clientKey];

            return new Promise(function (resolve, reject) {
                client('GET', action + uuid + '/', params).then(function (response) {
                    resolve(new GetTollfreeVerificationResponse(response.body, client));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * list TollfreeVerification requests
         * @method
         * @param {object} params - params to list TollfreeVerification requests
         * @param {string} [params.number] - The toll free number in e.164 for which verification is being initiated. Only single US/CA number can be provided
         * @param {string} [params.status] - The verification status of toll-free verification request.
         * @param {string} [params.created__gt] - gt stands for greater than. Filters all records after the specified date. 
         * @param {string} [params.created__gte] - gte stands for greater than or equal. To get all records that were created after or exactly on the mentioned date
         * @param {string} [params.created__lt] - lt stands for lesser than. Filters all records before the specified date.
         * @param {string} [params.created__lte] - lte stands for lesser than or equal. To get all records that were created before or exactly on the mentioned date 
         * @param {string} [params.usecase] - One or more use-cases of tollfree number with comma separation
         * @param {integer} [params.limit] - To display no of results per page
         * @param {integer} [params.offset] - No of value items by which results should be offset
          */

    }, {
        key: 'list',
        value: function list(params) {
            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('GET', action, params).then(function (response) {
                    var objects = [];
                    Object.defineProperty(objects, 'meta', {
                        value: response.body.meta,
                        enumerable: true
                    });
                    Object.defineProperty(objects, 'api_id', {
                        value: response.body.apiId,
                        enumerable: true
                    });
                    response.body.objects.forEach(function (item) {
                        objects.push(new ListTollfreeVerificationResponse(item, client));
                    });
                    resolve(objects);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * create TollfreeVerification request
         * @method
         * @param {object} params - params to create a TollfreeVerification request
         * @param {string} [params.profile_uuid] The unique identifier of an existing Plivo profile. 
         * @param {string} [params.usecase] The messaging usecase(s) for which the TF should be used for. One is mandatory, others can be added with comma separation
         * @param {string} [params.usecase_summary] The explanation on how messaging is used on this toll-free phone number by the business or organization. Max character limit = 500.
         * @param {string} [params.message_sample] Sample message(s) that the end-business will be sending to the end-user/mobile handset. Max character limit = 1000.
         * @param {string} [params.opt_in_image_url] A valid url where the customer submits images explaining details of the opt-in process for the end user. Multiple urls allowed with comma separation 
         * @param {string} [params.opt_in_type] Describes how a user opts-in to text messages.
         * @param {string} [params.volume] The monthly volume estimation of messages from the Toll-Free Number.
         * @param {string} [params.additional_information] Any additional information related to the website. Max character limit = 500.
         * @param {string} [params.extra_data] Any extra information which the customer would like to pass for internal references. 
         * @param {string} [params.number] The toll free number in e.164 for which verification is being initiated. Only single US/CA number can be provided
         * @param {string} [params.callback_url] A valid URL where verification relatated callbacks will be sent. 
         * @param {string} [params.callback_method] Valid Input: GET, POST
         * @promise {object} return {@link TollfreeVerification} object
         * @fail {Error} return Error
         */

    }, {
        key: 'create',
        value: function create() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('POST', action, params).then(function (response) {
                    resolve(new CreateTollfreeVerificationResponse(response.body));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * update TollfreeVerification request
         * @method
         * @param {string} uuid - uuid of tollfreeVerification request
         * @param {object} params - to update tollfreeVerification request
         * @param {string} [params.profile_uuid] The unique identifier of an existing Plivo profile. 
         * @param {string} [params.usecase] The messaging usecase(s) for which the TF should be used for. One is mandatory, others can be added with comma separation
         * @param {string} [params.usecase_summary] The explanation on how messaging is used on this toll-free phone number by the business or organization. Max character limit = 500.
         * @param {string} [params.message_sample] Sample message(s) that the end-business will be sending to the end-user/mobile handset. Max character limit = 1000.
         * @param {string} [params.opt_in_image_url] A valid url where the customer submits images explaining details of the opt-in process for the end user. Multiple urls allowed with comma separation 
         * @param {string} [params.opt_in_type] Describes how a user opts-in to text messages.
         * @param {string} [params.volume] The monthly volume estimation of messages from the Toll-Free Number.
         * @param {string} [params.additional_information] Any additional information related to the website. Max character limit = 500.
         * @param {string} [params.extra_data] Any extra information which the customer would like to pass for internal references. 
         * @param {string} [params.callback_url] A valid URL where verification relatated callbacks will be sent. 
         * @param {string} [params.callback_method] Valid Input: GET, POST     
         * @promise {object} return {@link TollfreeVerification} object
         * @fail {Error} return Error
         */

    }, {
        key: 'update',
        value: function update(uuid) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new TollfreeVerification(this[clientKey], {
                id: uuid
            }).update(params);
        }

        /**
         * delete TollfreeVerification request
         * @method
         * @param {string} uuid - uuid of tollfreeVerification request
         * @promise {object} return true on success
         * @fail {Error} return Error
         */

    }, {
        key: 'delete',
        value: function _delete(uuid) {
            return new TollfreeVerification(this[clientKey], {
                id: uuid
            }).delete();
        }
    }]);

    return TollfreeVerificationInterface;
}(_base.PlivoResourceInterface);