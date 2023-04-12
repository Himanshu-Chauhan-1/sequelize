////////////////////////// -GLOBAL- //////////////////////
const isValid = function (value) {
    if (!value || typeof value != "string" || value.trim().length == 0)
        return false;
    return true;
};

//////////////// -FOR EMPTY BODY- ///////////////////////
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

//////////////// -FOR userName- ///////////////////////
const isValidFullName = (fullName) => {
    return /^[a-zA-Z ]+$/.test(fullName);
};

//////////////// -FOR visitorName- ///////////////////////
const isValidVisitorName = (visitorName) => {
    return /^[a-zA-Z ]+$/.test(visitorName);
};

//////////////// -FOR MOBILE- ///////////////////////
const isValidPhone = (phone) => {
    return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone);
};

//////////////// -FOR EMAIL- ///////////////////////
const isValidEmail = (email) => {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
};

//////////////// -FOR NUMBER- ///////////////////////
const isValidNumber = (value) => {
    return /^[0-9]+$/.test(value);
};

module.exports = {
    isValid,
    isValidRequestBody,
    isValidVisitorName,
    isValidPhone,
    isValidEmail,
    isValidFullName,
    isValidNumber
}
