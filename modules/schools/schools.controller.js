const err = new Error();
const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const { errorHandler } = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/schools/schools.serializer'));

const index = async function (req, res) {
    try {
        const schools = await School.index(req);
        const responseData = await serializer.index(schools);
        return res.status(200).send({
            statusCode: 200,
            schools_count: schools.length,
            schools: responseData
        });
    } catch (error) {
        const err = errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
};//pagination(1 page-10limit),search(name),filters(by quantile q1,q2) in index api
//page,limit,name,filter(quantile)

module.exports = { index }