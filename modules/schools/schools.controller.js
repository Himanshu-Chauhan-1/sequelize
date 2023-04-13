const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const User = db.User
const { Op } = require("sequelize");

//========================================GET/GET-ALL-SCHOOLS===============================================================//

const getAllSchools = async function (req, res) {
    try {

        let data = req.query
        const { name, quintile } = data

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit

        //pagination 

        let attributes = ['id', 'name', 'contact_number', 'number_of_matric_student', 'total_number_of_student', 'learner_2019', 'educator_2019', 'phase_ped', 'quintile']

        if (Object.keys(req.query).length > 0) {

            let findSchoolsByFilter = await School.findAll({
                attributes: attributes,
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${name}%` } },
                        { quintile: { [Op.iLike]: `%${quintile}%` } },
                    ],
                },
                $sort: { id: 1 },
                offset: offset,
                limit: limit
            })

            if (!findSchoolsByFilter.length)
                return res.status(404).send({ status: "success", message: "No Schools found as per the filters applied" })

            return res.status(200).send({ status: "success", message: "Schools as per the filters applied:", schools_count: findSchoolsByFilter.length, data: findSchoolsByFilter })
        } else {

            const schoolData = await School.findAll({ attributes: attributes })

            if (schoolData.length === 0) {
                return res.status(422).send({ status: "success", message: "No Schools Found....." });
            }
            return res.status(200).send({ status: "success", message: 'All Schools details:', schools_count: schoolData.length, data: schoolData })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

//===========================================GET/GET-ALL-SCHOOLS-FOR-USER=====================================================//

const getAllSchoolsByUser = async function (req, res) {
    try {

        let data = req.query
        const { name, display_name, email } = data
        const whereOptions = {}

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit

        let userAttributes = ['id', 'first_name', 'last_name', 'display_name', 'email', 'phone', 'date_of_birth', 'nationality', 'province', 'city']

        let schoolAttributes = ['id', 'name', 'contact_number', 'number_of_matric_student', 'total_number_of_student', 'learner_2019', 'educator_2019', 'phase_ped', 'quintile']


        if (("name") in data) {


            let findUsersByFilters = await User.findAll({
                attributes: userAttributes,
                include: { model: School, as: 'schools', where: whereOptions, required: true },
                $sort: { id: 1 }, offset: offset, limit: limit,
            })

            if (!findUsersByFilters.length) return res.status(404).send({ status: "success", message: "No users found as per the filters applied" })

            return res.status(200).send({ status: "success", message: "Users:", users_count: findUsersByFilters.length, data: findUsersByFilters })
        }

        if (Object.keys(data).length > 0) {

            if (("display_name") || ("email") || ("display_name" && "name") || ("email" && "name") || ("email" && "display_name" && "name" || ("display_name" && "email")) in data) {

                let findUsersByFilters = await User.findAll({
                    attributes: userAttributes,
                    where: { [Op.or]: [{ display_name: { [Op.iLike]: `%${display_name}%` } }, { email: { [Op.iLike]: `%${email}%` } }] },
                    include: {
                        model: School, as: 'schools', where: { name: { [Op.iLike]: `%${name}%` } },
                        required: name ? true : false,
                    },
                    $sort: { id: 1 }, offset: offset, limit: limit
                })

                if (findUsersByFilters.length === 0) return res.status(422).send({ status: "success", message: "No Users Found as per filters applied....." });

                return res.status(200).send({ status: "success", message: "Users:", users_count: findUsersByFilters.length, data: findUsersByFilters })

            }
        } else {

            const userData = await User.findAll({ attributes: userAttributes, include: { model: School, as: 'schools', attributes: schoolAttributes } })

            if (userData.length === 0) return res.status(422).send({ status: "success", message: "No Users Found....." });

            return res.status(200).send({ status: "success", message: 'All Schools details:', users_count: userData.length, data: userData })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

module.exports = {
    getAllSchools,
    getAllSchoolsByUser
};
