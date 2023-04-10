const path = require('path');
const db = require(path.resolve('./models/index'));
const Space = db.Space;
const spaceType = ['Private', 'Public']
const { param, body, validationResult } = require('express-validator');

// CREATE SPACE RULES
const createSpaceRules = [
    body('name')
        .exists().withMessage('name is required')
        .isString().withMessage('name must be a string')
        .notEmpty().withMessage('name cannot be empty')
        .trim(),

    body('description')
        .exists().withMessage('description is required')
        .isString().withMessage('description must be a string')
        .notEmpty().withMessage('description cannot be empty')
        .trim(),

    body('type')
        .exists().withMessage('type does not exists.')
        .isString().withMessage('type must be a string.')
        .isIn(spaceType)
        .trim(),
]

const verifyRules = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array().shift();
      const payload = {
        statusCode: 422,
        message: error.msg,
        // param: error.param,
        value: error.value,
      };
      return res.status(422).jsonp(payload);
    } else {
      next();
    }
  };



module.exports = {
    createSpaceRules,
    verifyRules
}