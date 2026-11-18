'use strict';

var Joi = require('joi');

// Schema for Location
var locationSchema = Joi.object({
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required()
});

// Function to validate location data
function validateLocation(data) {
  var _locationSchema$valid = locationSchema.validate(data, { allowUnknown: true }),
      error = _locationSchema$valid.error,
      value = _locationSchema$valid.value;

  return { error: error, value: value };
}

module.exports = {
  locationSchema: locationSchema,
  validateLocation: validateLocation
};