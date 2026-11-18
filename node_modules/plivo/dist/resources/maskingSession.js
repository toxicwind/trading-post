'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MaskingSessionInterface = exports.MaskingSession = exports.ListMaskingSessionResponse = exports.UpdateMaskingSessionResponse = exports.DeleteMaskingSessionResponse = exports.GetMaskingSessionResponse = exports.CreateMaskingSessionResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _base = require('../base');

var _common = require('../utils/common.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientKey = Symbol();
var action = 'Masking/Session/';
var idField = 'sessionUuid';

var CreateMaskingSessionResponse = exports.CreateMaskingSessionResponse = function CreateMaskingSessionResponse(params) {
    _classCallCheck(this, CreateMaskingSessionResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.sessionUuid = params.sessionUuid;
    this.virtualNumber = params.virtualNumber;
    this.message = params.message;
    this.session = params.session;
};

var GetMaskingSessionResponse = exports.GetMaskingSessionResponse = function GetMaskingSessionResponse(params) {
    _classCallCheck(this, GetMaskingSessionResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.response = params.response;
};

var DeleteMaskingSessionResponse = exports.DeleteMaskingSessionResponse = function DeleteMaskingSessionResponse(params) {
    _classCallCheck(this, DeleteMaskingSessionResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.message = params.message;
};

var UpdateMaskingSessionResponse = exports.UpdateMaskingSessionResponse = function UpdateMaskingSessionResponse(params) {
    _classCallCheck(this, UpdateMaskingSessionResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.message = params.message;
    this.session = params.session;
};

var ListMaskingSessionResponse = exports.ListMaskingSessionResponse = function ListMaskingSessionResponse(params) {
    _classCallCheck(this, ListMaskingSessionResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.response = params.response;
};

var MaskingSession = exports.MaskingSession = function (_PlivoResource) {
    _inherits(MaskingSession, _PlivoResource);

    function MaskingSession(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MaskingSession);

        var _this = _possibleConstructorReturn(this, (MaskingSession.__proto__ || Object.getPrototypeOf(MaskingSession)).call(this, action, MaskingSession, idField, client));

        if (idField in data) {
            _this.id = data[idField];
        }

        (0, _common.extend)(_this, data);
        _this[clientKey] = client;
        return _this;
    }

    _createClass(MaskingSession, [{
        key: 'getMaskingSession',
        value: function getMaskingSession() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            params.isVoiceRequest = 'true';
            return _get(MaskingSession.prototype.__proto__ || Object.getPrototypeOf(MaskingSession.prototype), 'executeAction', this).call(this, this.id, 'GET', params);
        }
    }, {
        key: 'deleteMaskingSession',
        value: function deleteMaskingSession() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            params.isVoiceRequest = 'true';
            return _get(MaskingSession.prototype.__proto__ || Object.getPrototypeOf(MaskingSession.prototype), 'executeAction', this).call(this, this.id, 'DELETE', params);
        }
    }, {
        key: 'updateMaskingSession',
        value: function updateMaskingSession(params) {
            params.isVoiceRequest = 'true';
            return _get(MaskingSession.prototype.__proto__ || Object.getPrototypeOf(MaskingSession.prototype), 'executeAction', this).call(this, this.id, 'POST', params);
        }
    }]);

    return MaskingSession;
}(_base.PlivoResource);

var MaskingSessionInterface = exports.MaskingSessionInterface = function (_PlivoResourceInterfa) {
    _inherits(MaskingSessionInterface, _PlivoResourceInterfa);

    function MaskingSessionInterface(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MaskingSessionInterface);

        var _this2 = _possibleConstructorReturn(this, (MaskingSessionInterface.__proto__ || Object.getPrototypeOf(MaskingSessionInterface)).call(this, action, MaskingSession, idField, client));

        (0, _common.extend)(_this2, data);

        _this2[clientKey] = client;
        return _this2;
    }
    /**
    * Create a masking session
    * @method
    * @param {string} firstParty - The phone number or SIP endpoint of the first party.
    * @param {string} secondParty - The phone number or SIP endpoint of the second party.
    * @param {object} params - optional params to make a call
    * @param {number} [params.sessionExpiry]- The duration in seconds for which the masking session will be active.
    * @param {number} [params.callTimeLimit] - The maximum duration in seconds for each call in the masking session.
    * @param {boolean} [params.record] - Indicates whether the calls in the masking session should be recorded.
    * @param {string} [params.recordFileFormat] - The file format for the recorded calls.
    * @param {string} [params.recordingCallbackUrl] - The URL to which the recording callback will be sent.
    * @param {boolean} [params.initiateCallToFirstParty] - Indicates whether the call to the first party should be initiated automatically.
    * @param {string} [params.callbackUrl] - The URL to which the callback for the masking session will be sent.
    * @param {string} [params.callbackMethod] - The HTTP method for the callback request.
    * @param {number} [params.ringTimeout] - The duration in seconds for which the call will ring before being canceled.
    * @param {string} [params.firstPartyPlayUrl] - The URL to play audio to the first party when the call is established.
    * @param {string} [params.secondPartyPlayUrl] - The URL to play audio to the second party when the call is established.
    * @param {string} [params.recordingCallbackMethod] - The HTTP method for the recording callback request.
    * @param {boolean} [params.isPinAuthenticationRequired] - Indicates we need to authenticate pin or not.
    * @param {boolean} [params.generatePin] - Indicates we need to generate pin or not.
    * @param {number} [params.generatePinLength] - Pin length, by default = 4.
    * @param {string} [params.firstPartyPin] - First Party Pin.
    * @param {string} [params.secondPartyPin] - Second Party Pin.
    * @param {string} [params.pinPromptPlay] - Sound url to play during pin prompt.
    * @param {number} [params.pinRetry] - No of times retry allowed for wrong/invalid pin.
    * @param {number} [params.pinRetryWait] - Wait between consecutive retry.
    * @param {string} [params.incorrectPinPlay] - Sound url to play when wrong/invalid pin entered.
    * @param {boolean} [params.unknownCallerPlay] - Sound url to play for unknown caller.
    * @param {string} [params.subAccount] - SubAccount to create session.
    * @param {boolean} [params.geoMatch] - GeoMatch to filter no.
    * @param {number} [params.virtualNumberCooloffPeriod] - Specifies the cool-off period for reallocating the number to a new session. Must be a positive integer between 0 and 3600.
    * @param {boolean} [params.forcePinAuthentication] - Indicates if PIN is needed, even from the registered mobile number.
    * @param {boolean} [params.createSessionWithSingleParty] - Indicates if a session requires one party. Either first_party or second_party is mandatory.
    * @promise {object} returns PlivoGenericResponse Object
    * @fail {Error} returns Error
    */


    _createClass(MaskingSessionInterface, [{
        key: 'createMaskingSession',
        value: function createMaskingSession(firstParty, secondParty) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var errors = (0, _common.validate)([{
                field: 'first_party',
                value: firstParty,
                validators: []
            }, {
                field: 'second_party',
                value: secondParty,
                validators: []
            }]);
            params.firstParty = firstParty;
            params.secondParty = secondParty;
            params.isVoiceRequest = 'true';

            var client = this[clientKey];
            return new Promise(function (resolve, reject) {
                client('POST', 'Masking/Session/', params).then(function (response) {
                    resolve(new CreateMaskingSessionResponse(response.body, idField));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * Update a masking session
         * @method
         * @param {string} sessionUuid - unique idenfier of a session
         * @param {object} params - optional params to update a session
         * @param {number} [params.sessionExpiry] - The duration in seconds for which the masking session will be active.
         * @param {number} [params.callTimeLimit] - The maximum duration in seconds for each call in the masking session.
         * @param {boolean} [params.record] - Indicates whether the calls in the masking session should be recorded.
         * @param {string} [params.recordFileFormat] - The file format for the recorded calls.
         * @param {string} [params.recordingCallbackUrl] - The URL to which the recording callback will be sent.
         * @param {string} [params.callbackUrl] - The URL to which the callback for the masking session will be sent.
         * @param {string} [params.callbackMethod] - The HTTP method for the callback request.
         * @param {number} [params.ringTimeout] - The duration in seconds for which the call will ring before being canceled.
         * @param {string} [params.firstPartyPlayUrl] - The URL to play audio to the first party when the call is established.
         * @param {string} [params.secondPartyPlayUrl] - The URL to play audio to the second party when the call is established.
         * @param {string} [params.recordingCallbackMethod] - The HTTP method for the recording callback request.
         * @returns {Promise<PlivoGenericResponse>} - Resolves to a PlivoGenericResponse object
         * @throws {Error} - Throws an error if the update masking session request fails
         */

    }, {
        key: 'updateMaskingSession',
        value: function updateMaskingSession(sessionUuid) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var errors = (0, _common.validate)([{
                field: 'session_uuid',
                value: sessionUuid,
                validators: ['isRequired']
            }]);
            params.sessionUuid = sessionUuid;
            params.isVoiceRequest = 'true';

            if (errors) {
                return errors;
            }
            return new MaskingSession(this[clientKey], {
                id: sessionUuid
            }).updateMaskingSession(params);
        }
        /**
        * List masking sessions with optional filters
        * @method
        * @param {object} filterParams - Optional filter parameters to list masking sessions
        * @param {string} [filterParams.firstParty] - The phone number or SIP endpoint of the first party.
        * @param {string} [filterParams.secondParty] - The phone number or SIP endpoint of the second party.
        * @param {string} [filterParams.virtualNumber] - The virtual number associated with the masking session.
        * @param {string} [filterParams.status] - The status of the masking session.
        * @param {string} [filterParams.createdTimeEquals] - The specific created time to filter sessions.
        * @param {string} [filterParams.createdTimeLessThan] - Filter sessions created before this time.
        * @param {string} [filterParams.createdTimeGreaterThan] - Filter sessions created after this time.
        * @param {string} [filterParams.createdTimeLessOrEqual] - Filter sessions created before or at this time.
        * @param {string} [filterParams.createdTimeGreaterOrEqual] - Filter sessions created after or at this time.
        * @param {string} [filterParams.expiryTimeEquals] - The specific expiry time to filter sessions.
        * @param {string} [filterParams.expiryTimeLessThan] - Filter sessions expiring before this time.
        * @param {string} [filterParams.expiryTimeGreaterThan] - Filter sessions expiring after this time.
        * @param {string} [filterParams.expiryTimeLessOrEqual] - Filter sessions expiring before or at this time.
        * @param {string} [filterParams.expiryTimeGreaterOrEqual] - Filter sessions expiring after or at this time.
        * @param {number} [filterParams.durationEquals] - The duration in seconds to filter sessions.
        * @param {number} [filterParams.durationLessThan] - Filter sessions with duration less than this value.
        * @param {number} [filterParams.durationGreaterThan] - Filter sessions with duration greater than this value.
        * @param {number} [filterParams.durationLessOrEqual] - Filter sessions with duration less than or equal to this value.
        * @param {number} [filterParams.durationGreaterOrEqual] - Filter sessions with duration greater than or equal to this value.
        * @param {number} [filterParams.limit] - The maximum number of sessions to retrieve.
        * @param {number} [filterParams.offset] - The offset for paginated results.
        * @returns {Promise<PlivoGenericResponse>} - Resolves to a PlivoGenericResponse object
        * @throws {Error} - Throws an error if the list masking sessions request fails
        */

    }, {
        key: 'listMaskingSession',
        value: function listMaskingSession(params) {
            var client = this[clientKey];
            if (params === undefined) {
                params = {};
            }
            params.isVoiceRequest = 'true';
            return new Promise(function (resolve, reject) {
                client('GET', 'Masking/Session/', params).then(function (response) {
                    resolve(new ListMaskingSessionResponse(response.body, idField));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
        /**
            * Get a masking session
            * @method
         * @param {string} sessionUuid - unique idenfier of a session
         * @promise {object} returns PlivoGenericResponse Object
            * @fail {Error} returns Error
            */

    }, {
        key: 'getMaskingSession',
        value: function getMaskingSession(sessionUuid) {
            var errors = (0, _common.validate)([{
                field: 'sessionUuid',
                value: sessionUuid,
                validators: ['isRequired']
            }]);
            if (errors) {
                return errors;
            }
            return new MaskingSession(this[clientKey], {
                id: sessionUuid
            }).getMaskingSession();
        }
        /**
         * Delete a masking session
         * @method
        * @param {string} sessionUuid - unique idenfier of a session
        * @promise {object} returns PlivoGenericResponse Object
         * @fail {Error} returns Error
         */

    }, {
        key: 'deleteMaskingSession',
        value: function deleteMaskingSession(sessionUuid) {
            var errors = (0, _common.validate)([{
                field: 'sessionUuid',
                value: sessionUuid,
                validators: ['isRequired']
            }]);
            if (errors) {
                return errors;
            }
            return new MaskingSession(this[clientKey], {
                id: sessionUuid
            }).deleteMaskingSession();
        }
    }]);

    return MaskingSessionInterface;
}(_base.PlivoResourceInterface);