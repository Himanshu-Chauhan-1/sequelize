const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const { isValid, isValidNumber } = require(path.resolve('./utilities/validator'))

//=====================================================Get-All-Schools=========================================================//

const getAllSchools = async function (req, res, next) {
    try {

        let data = req.query

        const { name, quintile, page, limit } = data

        if ("name" in data) {
            if (!isValid(name)) return res.status(422).send({ status: "error", message: "name is required" })
        }

        if ("quintile" in data) {
            if (!isValid(quintile)) return res.status(422).send({ status: "error", message: "quintile is required" })
        }

        if ("page" in data) {
            if (!isValid(page)) return res.status(422).send({ status: "error", message: "page no. is required" })
            if (!isValidNumber(page)) return res.status(422).send({ status: "error", message: "Page no. can only be a Number" })
        }

        if ("limit" in data) {
            if (!isValid(limit)) return res.status(422).send({ status: "error", message: "limit is required" })
            if (!isValidNumber(limit)) return res.status(422).send({ status: "error", message: "limit can only be a Number" })
        }

        next()
    } catch (error) {
        console.log(error.message);
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
}

module.exports = {
    getAllSchools
}