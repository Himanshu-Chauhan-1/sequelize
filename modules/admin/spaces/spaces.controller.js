const err = new Error();
const path = require('path');
const db = require(path.resolve('./models/index'));
const Space = db.Space;
const { errorHandler } = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/spaces/spaces.serializer'));

const create = async function (req, res) {
    try {
        const space = await Space.createSpace(req);
        const responseData = await serializer.show(space);
        return res.status(201).send({
            statusCode: 201,
            message: 'A new space has been created successfully.',
            space: responseData,
        });
    } catch (error) {
        const err = errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
};//pagination(1 page-10limit),search(name),filters(by quantile q1,q2) in index api
//page,limit,name,filter(quantile)

module.exports = { create }