const path = require('path');
const db = require(path.resolve('./models/index'));
const User = db.User
const Role = db.Role
const { Op } = require("sequelize");

//========================================GET/GET-ALL-USERS-PROVINCE============================================================//

const getAllUsersByProvince = async function (req, res) {
    try {

        let data = req.query
        const { province, userClass } = data
        const whereOptions = {}
        whereOptions["province"] = province

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit


        let userAttributes = ['id', 'first_name', 'last_name', 'display_name', 'email', 'phone', 'date_of_birth', 'nationality', 'province', 'city']


        if (Object.keys(req.query).length > 0) {

            let findUsersByFilter = await User.findAll({
                attributes: userAttributes, where: whereOptions, $sort: { id: 1 },
                offset: offset, limit: limit, required: true
            })

            if (findUsersByFilter.length === 0)
                return res.status(404).send({ status: "success", message: "No Users found as per the province enetered" })

            return res.status(200).send({ status: "success", message: "Users as per the province entered:", users_count: findUsersByFilter.length, data: findUsersByFilter })

        } else {

            const userData = await User.findAll({ attributes: userAttributes })

            if (userData.length === 0) {
                return res.status(422).send({ status: "success", message: "No Users Found....." });
            }
            return res.status(200).send({ status: "success", message: 'All Users details:', users_count: userData.length, data: userData })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

//========================================GET/GET-ALL-USERS-BY-USERCLASS/ROLE=======================================================//

const getAllUsersByUserClass = async function (req, res) {
    try {

        let data = req.query
        const { name } = data
        const whereOptions = {}

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit


        let userAttributes = ['id', 'first_name', 'last_name', 'display_name', 'email', 'phone', 'date_of_birth', 'nationality', 'province', 'city']

        let roleAttributes = ['id', 'name']


        if (Object.keys(data).length > 0) {

            whereOptions["name"] = name

            let findUsersByFilter = await User.findAll({
                attributes: userAttributes,
                include: { model: Role, as: 'roles', where: whereOptions, required: true, attributes: roleAttributes },
                offset: offset, limit: limit, required: true
            })

            if (findUsersByFilter.length === 0)
                return res.status(404).send({ status: "success", message: "No Users found as per the role enetered" })

            return res.status(200).send({ status: "success", message: "Users as per the role entered:", users_count: findUsersByFilter.length, data: findUsersByFilter })

        } else {

            const userData = await User.findAll({
                attributes: userAttributes,
                include: { model: Role, as: 'roles', required: true, attributes: roleAttributes }
            })

            if (userData.length === 0) {
                return res.status(422).send({ status: "success", message: "No Users Found....." });
            }

            return res.status(200).send({ status: "success", message: 'All Users details:', users_count: userData.length, data: userData })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

module.exports = {
    getAllUsersByProvince,
    getAllUsersByUserClass
};
