const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const { param, body, validationResult } = require('express-validator');

// CREATE SCHOOL RULES
const getSchoolRules = [
    param('schoolId')
        .exists().withMessage('schoolId does not exists.')
        .isString().withMessage('schoolId must be a string.')
        .notEmpty().withMessage('schoolId cannot be empty.')
        .custom((value) => {
            return School.findByPk(value).then((school) => {
                if (!school) {
                    return Promise.reject(new Error('school not found.'));
                }
                return true;
            });
        }),
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
    getSchoolRules,
    verifyRules
}