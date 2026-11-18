'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageInterface = exports.Message = exports.MMSMedia = exports.MMSMediaResponse = exports.MessageListResponse = exports.MessageGetResponse = exports.MessageResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _base = require('../base');

var _common = require('../utils/common.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var action = 'Message/';
var idField = 'messageUuid';
var actionKey = Symbol('api action');
var klassKey = Symbol('constructor');
var idKey = Symbol('id filed');
var clientKey = Symbol('make api call');

var MessageResponse = exports.MessageResponse = function MessageResponse(params) {
    _classCallCheck(this, MessageResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.message = params.message;
    this.messageUuid = params.messageUuid;
    if (params.invalidNumber != undefined) {
        this.invalid_number = params.invalidNumber;
    }
};

var MessageGetResponse = exports.MessageGetResponse = function MessageGetResponse(params) {
    _classCallCheck(this, MessageGetResponse);

    params = params || {};
    this.apiId = params.apiId;
    this.errorCode = params.errorCode;
    this.fromNumber = params.fromNumber;
    this.messageDirection = params.messageDirection;
    this.messageState = params.messageState;
    this.messageTime = params.messageTime;
    this.messageType = params.messageType;
    this.messageUuid = params.messageUuid;
    this.resourceUri = params.resourceUri;
    this.toNumber = params.toNumber;
    this.totalAmount = params.totalAmount;
    this.totalRate = params.totalRate;
    this.units = params.units;
    this.powerpackID = params.powerpackId;
    this.tendlcCampaignId = params.tendlcCampaignId;
    this.tendlcRegistrationStatus = params.tendlcRegistrationStatus;
    this.destinationCountryIso2 = params.destinationCountryIso2;
    this.requesterIP = params.requesterIp;
    this.isDomestic = params.isDomestic;
    this.replacedSender = params.replacedSender;

    this.conversationId = params.conversationId;
    this.conversationOrigin = params.conversationOrigin;
    this.conversationExpirationTimestamp = params.conversationExpirationTimestamp;
    this.dltEntityID = params.dltEntityId;
    this.dltTemplateID = params.dltTemplateId;
    this.dltTemplateCategory = params.dltTemplateCategory;
    this.destinationNetwork = params.destinationNetwork;
    this.carrierFees = params.carrierFees;
    this.carrierFeesRate = params.carrierFeesRate;
    this.log = params.log;
    this.messageSentTime = params.messageSentTime;
    this.messageUpdatedTime = params.messageUpdatedTime;
    this.errorMessage = params.errorMessage;
};

var MessageListResponse = exports.MessageListResponse = function MessageListResponse(params) {
    _classCallCheck(this, MessageListResponse);

    params = params || {};
    this.errorCode = params.errorCode;
    this.fromNumber = params.fromNumber;
    this.messageDirection = params.messageDirection;
    this.messageState = params.messageState;
    this.messageTime = params.messageTime;
    this.messageType = params.messageType;
    this.messageUuid = params.messageUuid;
    this.resourceUri = params.resourceUri;
    this.toNumber = params.toNumber;
    this.totalAmount = params.totalAmount;
    this.totalRate = params.totalRate;
    this.units = params.units;
    this.powerpackID = params.powerpackId;
    this.tendlcCampaignId = params.tendlcCampaignId;
    this.tendlcRegistrationStatus = params.tendlcRegistrationStatus;
    this.destinationCountryIso2 = params.destinationCountryIso2;
    this.requesterIP = params.requesterIp;
    this.isDomestic = params.isDomestic;
    this.replacedSender = params.replacedSender;
    this.conversationId = params.conversationId;
    this.conversationOrigin = params.conversationOrigin;
    this.conversationExpirationTimestamp = params.conversationExpirationTimestamp;
    this.dltEntityID = params.dltEntityId;
    this.dltTemplateID = params.dltTemplateId;
    this.dltTemplateCategory = params.dltTemplateCategory;
    this.destinationNetwork = params.destinationNetwork;
    this.carrierFees = params.carrierFees;
    this.carrierFeesRate = params.carrierFeesRate;
    this.log = params.log;
    this.messageSentTime = params.messageSentTime;
    this.messageUpdatedTime = params.messageUpdatedTime;
    this.errorMessage = params.errorMessage;
};

var MMSMediaResponse = exports.MMSMediaResponse = function MMSMediaResponse(params) {
    _classCallCheck(this, MMSMediaResponse);

    params = params || {};
    this.apiId = params.apiId;
    var MMSMediaList = [];
    params.objects.forEach(function (item) {
        MMSMediaList.push(new MMSMedia(item));
    });
    this.objects = MMSMediaList;
};

var MMSMedia = exports.MMSMedia = function MMSMedia(params) {
    _classCallCheck(this, MMSMedia);

    params = params || {};
    this.contentType = params.contentType;
    this.fileName = params.fileName;
    this.mediaId = params.mediaId;
    this.mediaUrl = params.mediaUrl;
    this.messageUuid = params.messageUuid;
    this.size = params.size;
    this.uploadTime = params.uploadTime;
};

/**
 * Represents a Message
 * @constructor
 * @param {function} client - make api call
 * @param {object} [data] - data of call
 */


var Message = exports.Message = function (_PlivoResource) {
    _inherits(Message, _PlivoResource);

    function Message(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Message);

        var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, action, Message, idField, client));

        _this[actionKey] = action;
        _this[clientKey] = client;
        if (idField in data) {
            _this.id = data[idField];
        };

        (0, _common.extend)(_this, data);
        return _this;
    }

    _createClass(Message, [{
        key: 'listMedia',
        value: function listMedia() {
            var _this2 = this;

            //return super.executeAction(this.id + '/Media/', 'Get', {});
            var client = this[clientKey];
            var idField = this[idKey];
            return new Promise(function (resolve, reject) {
                client('Get', _this2[actionKey] + _this2.id + '/Media/', {}).then(function (response) {
                    resolve(new MMSMediaResponse(response.body, idField));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }]);

    return Message;
}(_base.PlivoResource);

/**
 * Represents a Message Interface
 * @constructor
 * @param {function} client - make api call
 * @param {object} [data] - data of call
 */


var MessageInterface = exports.MessageInterface = function (_PlivoResourceInterfa) {
    _inherits(MessageInterface, _PlivoResourceInterfa);

    function MessageInterface(client) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MessageInterface);

        var _this3 = _possibleConstructorReturn(this, (MessageInterface.__proto__ || Object.getPrototypeOf(MessageInterface)).call(this, action, Message, idField, client));

        (0, _common.extend)(_this3, data);
        _this3[clientKey] = client;
        _this3[actionKey] = action;
        _this3[klassKey] = Message;
        _this3[idKey] = idField;
        return _this3;
    }

    /**
     * Send Message
     * @method
     * @param {string} src - source number
     * @param {string} dst - destination number
     * @param {string} text - text to send
     * @param {object} optionalParams - Optional Params to send message
     * @param {string} [optionalParams.type] - The type of message. Should be `sms` `whatsapp` or `mms`. Defaults to `sms`.
     * @param {string} [optionalParams.url] The URL to which with the status of the message is sent.
     * @param {string} [optionalParams.method] The method used to call the url. Defaults to POST.
     * @param {list} [optionalParams.media_urls] For sending mms, specify the media urls in list of string
     * @param {int} [optionalParams.message_expiry] The method used to expiry the message specified time.
     * @param {string} [optionalParams.log] If set to false, the content of this message will not be logged on the Plivo infrastructure and the dst value will be masked (e.g., 141XXXXX528),if set to content_only only number will be masked, if set to number_only only text would be masked .Default is set to true.
     * @param {string} [optionalParams.dlt_entity_id] This is the DLT entity id passed in the message request.
     * @param {string} [optionalParams.dlt_template_id] This is the DLT template id passed in the message request.
     * @param {string} [optionalParams.dlt_template_category] This is the DLT template category passed in the message request.
     * @param {Template} [optionalParams.template] For sending templated whatsapp messages.
     * @param {Interactive} [optionalParams.interactive] For sending interactive whatsapp messages.
     * @param {Location} [optionalParams.location] For sending location whatsapp messages.
     * @promise {object} return {@link PlivoGenericMessage} object if success
     * @fail {Error} return Error
     */

    _createClass(MessageInterface, [{
        key: 'send',
        value: function send(src, dst, text, optionalParams) {
            return this.create(src, dst, text, optionalParams);
        }

        /**
         * Send Message
         * @method
         * @param {string} src - source number
         * @param {string} dst - destination number
         * @param {string} text - text to send
         * @param {object} optionalParams - Optional Params to send message
         * @param {string} [optionalParams.type] - The type of message. Should be `sms` `whatsapp` or `mms`. Defaults to `sms`.
         * @param {string} [optionalParams.url] The URL to which with the status of the message is sent.
         * @param {string} [optionalParams.method] The method used to call the url. Defaults to POST.
         * @param {string} [optionalParams.log] If set to false, the content of this message will not be logged on the Plivo infrastructure and the dst value will be masked (e.g., 141XXXXX528),if set to content_only only number will be masked, if set to number_only only text would be masked .Default is set to true.
         * @param {Array} [optionalParams.media_urls] For sending mms, specify the media urls in list of string
         * @param {Template} [optionalParams.template] //For sending templated whatsapp messages
         * @param {string} [optionalParams.dlt_entity_id] This is the DLT entity id passed in the message request.
         * @param {string} [optionalParams.dlt_template_id] This is the DLT template id passed in the message request.
         * @param {string} [optionalParams.dlt_template_category] This is the DLT template category passed in the message request.
         * @param {Interactive} [optionalParams.interactive] For sending interactive whatsapp messages.
         * @param {Location} [optionalParams.location] For sending location whatsapp messages.
         * @promise {object} return {@link PlivoGenericMessage} object if success
         * @fail {Error} return Error
         */

    }, {
        key: 'create',
        value: function create(src, dst, text, optionalParams, powerpackUUID) {
            var isObject = arguments.length;
            if (isObject == 1) {
                var powerpackUUID = src.powerpackUUID;
                var text = src.text;
                var dst = src.dst;
                var url = src.url;
                var method = src.method;
                var type = src.type;
                var media_urls = src.media_urls;
                var media_ids = src.media_ids;
                var log = src.log;
                var trackable = src.trackable;
                var messageExpiry = src.messageExpiry;
                var template = src.template;
                var interactive = src.interactive;
                var location = src.location;
                var dlt_entity_id = src.dlt_entity_id;
                var dlt_template_id = src.dlt_template_id;
                var dlt_template_category = src.dlt_template_category;
                var src = src.src;
            }

            var errors = (0, _common.validate)([{
                field: 'dst',
                value: dst,
                validators: ['isRequired']
            }]);

            if (errors) {
                return errors;
            }
            if (!src && !powerpackUUID) {
                var errorText = 'Neither of src or powerpack uuid present, either one is required';
                return new Promise(function (resolve, reject) {
                    reject(new Error(errorText));
                });
            }

            if (src && powerpackUUID) {
                var _errorText = 'Either of src or powerpack uuid, both of them are present';
                return new Promise(function (resolve, reject) {
                    reject(new Error(_errorText));
                });
            }

            var params = optionalParams || {};

            if (isObject == 1) {
                if (url) {
                    params.url = url;
                }
                if (method) {
                    params.method = method;
                }
                if (type) {
                    params.type = type;
                }
                if (media_urls) {
                    params.media_urls = media_urls;
                }
                if (media_ids) {
                    params.media_ids = media_ids;
                }
                if (log) {
                    params.log = log;
                }
                if (trackable) {
                    params.trackable = trackable;
                }
                if (messageExpiry) {
                    params.message_expiry = messageExpiry;
                }
                if (template) {
                    params.template = template;
                }
                if (interactive) {
                    params.interactive = interactive;
                }
                if (location) {
                    params.location = location;
                }
                if (dlt_entity_id) {
                    params.dlt_entity_id = dlt_entity_id;
                }
                if (dlt_template_id) {
                    params.dlt_template_id = dlt_template_id;
                }
                if (dlt_template_category) {
                    params.dlt_template_category = dlt_template_category;
                }
            }

            if (params.type === 'whatsapp' && !src) {
                var _errorText2 = 'src parameter not present';
                return new Promise(function (resolve, reject) {
                    reject(new Error(_errorText2));
                });
            }

            if (params.template) {
                var _errors = (0, _common.validate)([{
                    field: 'template',
                    value: params.template,
                    validators: ['isTemplate']
                }]);

                if (_errors) {
                    return _errors;
                }
            }

            if (params.interactive) {
                var _errors2 = (0, _common.validate)([{
                    field: 'interactive',
                    value: params.interactive,
                    validators: ['isInteractive']
                }]);

                if (_errors2) {
                    return _errors2;
                }
            }

            if (params.location) {
                var _errors3 = (0, _common.validate)([{
                    field: 'location',
                    value: params.location,
                    validators: ['isLocation']
                }]);

                if (_errors3) {
                    return _errors3;
                }
            }

            if (src) {
                params.src = src;
            }
            params.dst = _.isArray(dst) ? _.join(dst, '<') : dst;
            params.text = text;
            if (powerpackUUID) {
                params.powerpackUUID = powerpackUUID;
            }

            var client = this[clientKey];
            var idField = this[idKey];
            var action = this[actionKey] + (this.id ? this.id + '/' : '');

            return new Promise(function (resolve, reject) {
                client('POST', action, params).then(function (response) {
                    resolve(new MessageResponse(response.body, idField));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        /**
         * Get Message by given id
         * @method
         * @param {string} id - id of message
         * @promise {object} return {@link Message} object if success
         * @fail {Error} return Error
         */

    }, {
        key: 'get',
        value: function get(id) {
            var _this4 = this;

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
                    reject(new Error(_this4[idKey] + ' must be set'));
                }
                client('GET', action + (id ? id + '/' : '')).then(function (response) {
                    resolve(new MessageGetResponse(response.body, client));
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
                    var objects = [];
                    Object.defineProperty(objects, 'meta', {
                        value: response.body.meta,
                        enumerable: true
                    });
                    Object.defineProperty(objects, 'apiId', {
                        value: response.body.apiId,
                        enumerable: true
                    });
                    response.body.objects.forEach(function (item) {
                        objects.push(new MessageListResponse(item, client));
                    });
                    resolve(objects);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }, {
        key: 'listMedia',
        value: function listMedia(messageUUID) {
            return new Message(this[clientKey], {
                id: messageUUID
            }).listMedia();
        }
    }]);

    return MessageInterface;
}(_base.PlivoResourceInterface);