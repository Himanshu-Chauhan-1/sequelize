const path = require('path');
const { param, query, body, validationResult } = require('express-validator');

const getAllSchools = [
    query('name').optional()
        .notEmpty().withMessage('display_name cannot be empty')
        .isString().withMessage('display_name must be a string')
        .trim(),
    query('quintile').optional()
        .notEmpty().withMessage('quintile cannot be empty')
        .trim(),
    query('page').optional()
        .isNumeric().withMessage('page must be a number')
        .trim(),
    query('limit').optional()
        .isNumeric().withMessage('name must be a number')
        .trim(),
]

const getAllSchoolsByUser = [
    query('display_name').optional()
        .notEmpty().withMessage('display_name cannot be empty')
        .isString().withMessage('display_name must be a string')
        .trim(),
    query('email').optional()
        .notEmpty().withMessage('email cannot be empty')
        .trim(),
    query('name').optional()
        .notEmpty().withMessage('name cannot be empty')
        .isString().withMessage('name must be a string')
        .trim(),
]

const verifyRules = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array().shift();
        const payload = {
            statusCode: 422,
            message: error.msg,
            param: error.param,
            value: error.value,
        };
        return res.status(422).jsonp(payload);
    } else {
        next();
    }
};

module.exports = {
    verifyRules,
    getAllSchools,
    getAllSchoolsByUser
}