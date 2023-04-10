/**
 * Method to handle the error response.
 * @param {Object} err The error object.
 * @return {Object} the error json object with `statusCode` and `message`.
 **/
const errorHandler = function (err) {
    console.log(err);
    const error = {};
    if (err.message) {
        error.message = err.message;
    }
    error.meta = err.meta || undefined;
    error.statusCode = err.statusCode || 500;
    return error;
};

module.exports = {
    errorHandler,
};
