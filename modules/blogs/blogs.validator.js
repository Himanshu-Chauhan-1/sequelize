const path = require('path');
const { param, query, body, validationResult } = require('express-validator');

const getAllBlogs = [
    query('name').optional()
        .notEmpty().withMessage('title cannot be empty'),
    query('title').optional()
        .notEmpty().withMessage('title cannot be empty'),
    query('page').optional()
        .isNumeric().withMessage('page must be a number')
        .trim(),
    query('limit').optional()
        .isNumeric().withMessage('name must be a number')
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
    getAllBlogs
}