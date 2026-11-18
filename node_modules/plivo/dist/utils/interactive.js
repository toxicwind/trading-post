'use strict';

var Joi = require('joi');

// Schema for Row
var rowSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional()
});

// Schema for Section
var sectionSchema = Joi.object({
  title: Joi.string().optional(),
  rows: Joi.array().items(rowSchema).optional()
});

// Schema for Buttons
var buttonsSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().optional(),
  cta_url: Joi.string().optional()
});

// Schema for Action
var actionSchema = Joi.object({
  buttons: Joi.array().items(buttonsSchema).optional(),
  sections: Joi.array().items(sectionSchema).optional()
});

// Schema for Header
var headerSchema = Joi.object({
  type: Joi.string().optional(),
  text: Joi.string().optional(),
  media: Joi.string().optional()
});

// Schema for Body
var bodySchema = Joi.object({
  text: Joi.string().optional()
});

// Schema for Footer
var footerSchema = Joi.object({
  text: Joi.string().optional()
});

// Schema for Interactive
var interactiveSchema = Joi.object({
  type: Joi.string().optional(),
  header: headerSchema.optional(),
  body: bodySchema.optional(),
  footer: footerSchema.optional(),
  action: actionSchema.optional()
});

// Function to validate the data against the interactiveSchema
function validateInteractive(data) {
  var _interactiveSchema$va = interactiveSchema.validate(data, { allowUnknown: true }),
      error = _interactiveSchema$va.error,
      value = _interactiveSchema$va.value;

  return { error: error, value: value };
}

module.exports = {
  validateInteractive: validateInteractive
};