const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const User = db.User
const Role = db.Role
const UserRole = db.UserRole
const UserSchool = db.UserSchool
const { Op } = require("sequelize");
const sequelize = require("sequelize");

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

            whereOptions['name'] = name

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

//===========================================GET/GET-ALL-SCHOOLS-FOR-LEARNER=====================================================//

const getAllSchoolsByLearner = async function (req, res) {
    try {

        let findLearnerRoleId = await Role.findOne({ where: { name: "Learner" } })
        let learnerRoleId = findLearnerRoleId.id

        let findTeacherRoleId = await Role.findOne({ where: { name: "Learner" } })
        let teacherRoleId = findTeacherRoleId.id

        let userAttributes = ['id', 'display_name', 'email']

        let schoolAttributes = ['id', 'name', 'quintile']

        const schoolsWithMaxLearners = await UserSchool.findAll({
            attributes: [[sequelize.col('UserSchool.school_id'), 'school_id'], [sequelize.fn('COUNT', sequelize.col('UserSchool.school_id')), 'learnerCount']],
            group: sequelize.col('UserSchool.school_id'),
            raw: true,
            include: [{
                model: UserRole,
                as: 'learner',
                attributes: [],
                where: {
                    role_id: learnerRoleId
                }
            }],
            subQuery: false,
            limit: 5,
            order: [['learnerCount', 'DESC']],
        })

        let firstMaximumschool = schoolsWithMaxLearners[0].school_id
        let secondMaximumSchool = schoolsWithMaxLearners[1].school_id
        let thirdMaximumSchool = schoolsWithMaxLearners[2].school_id
        let fourthMaximumSchool = schoolsWithMaxLearners[3].school_id
        let fifthMaximumSchool = schoolsWithMaxLearners[4].school_id

        let arrayOfSchoolsIds = [firstMaximumschool, secondMaximumSchool, thirdMaximumSchool, fourthMaximumSchool, fifthMaximumSchool]

        let findTeachersOfMaximumSchools = await School.findAll({
            attributes: schoolAttributes,
            where: {
                id: { [Op.in]: arrayOfSchoolsIds }
            },
            include: [{
                model: UserSchool,
                as: "teachers",
                attributes: ['user_id', 'school_id'],
                include: {
                    model: UserRole,
                    as: "teacher",
                    attributes: [],
                    where: {
                        role_id: teacherRoleId
                    },
                }
            }],
            subQuery: false
        })

        let firstTeacherId = findTeachersOfMaximumSchools[0].teachers[0].user_id
        let secondTeacherId = findTeachersOfMaximumSchools[1].teachers[1].user_id
        let thirdTeacherId = findTeachersOfMaximumSchools[2].teachers[2].user_id
        let fourthTeacherId = findTeachersOfMaximumSchools[3].teachers[3].user_id
        let fifthTeacherId = findTeachersOfMaximumSchools[4].teachers[4].user_id

        let arrayOfTeacherIds = [firstTeacherId, secondTeacherId, thirdTeacherId, fourthTeacherId, fifthTeacherId]

        let findTeachersEmailOfMaximumSchools = await School.findAll({
            attributes: schoolAttributes,
            where: {
                id: { [Op.in]: arrayOfSchoolsIds }
            },
            include: [{
                model: User,
                as: "users",
                attributes: userAttributes,
                where: {
                    id: { [Op.in]: arrayOfTeacherIds }
                }
            }],
            subQuery: false
        })


        let response = {
            // schoolsWithMaxLearners: schoolsWithMaxLearners,
            // teachersFromSchoolWithMaximumLearners: findTeachersOfMaximumSchools
            teachersEmailOfMaximumSchools: findTeachersEmailOfMaximumSchools
        }


        // if (!findSchoolsByLearner.length) return res.status(404).send({ status: "success", message: "No users found as per the filters applied" })

        return res.status(200).send({ status: "success", message: "Schools:", data: response })


    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

module.exports = {
    getAllSchools,
    getAllSchoolsByUser,
    getAllSchoolsByLearner
};
