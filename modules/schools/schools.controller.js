const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const User = db.User
const Role = db.Role
const UserRole = db.UserRole
const UserSchool = db.UserSchool
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');

//=========================================GET/GET-ALL-SCHOOLS=====================================================//

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

//==========================================GET/GET-ALL-SCHOOLS-FOR-USER===========================================//

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

//==========================================GET/GET-FIVE-MAXIMUM-SCHOOLS==========================================//

const getFiveMaximumSchools = async function (req, res) {
    try {

        const findLearnerRoleId = await Role.findOne({ where: { name: "Learner" } })
        const learnerRoleId = findLearnerRoleId.id

        const findTeacherRoleId = await Role.findOne({ where: { name: "Teacher" } })
        const teacherRoleId = findTeacherRoleId.id

        const userAttributes = ['email']
        const schoolAttributes = ['id', 'name', 'quintile']
        const userSchoolAttributes = ['user_id', 'school_id']

        //Number of registrants(learners) of five maximum schools
        const schoolsWithMaxRegistrants = await UserSchool.findAll({
            attributes: [[sequelize.col('UserSchool.school_id'), 'school_id'],
            [sequelize.fn('COUNT', sequelize.col('UserSchool.school_id')), 'registrantsCount']],
            group: sequelize.col('UserSchool.school_id'),
            raw: true,
            include: {
                model: UserRole, as: 'learner', attributes: [],
                where: { role_id: learnerRoleId }
            },
            subQuery: false, limit: 5, order: [['registrantsCount', 'DESC']]
        })

        const firstMaximumschool = schoolsWithMaxRegistrants[0].school_id || null
        const secondMaximumSchool = schoolsWithMaxRegistrants[1].school_id || null
        const thirdMaximumSchool = schoolsWithMaxRegistrants[2].school_id || null
        const fourthMaximumSchool = schoolsWithMaxRegistrants[3].school_id || null
        const fifthMaximumSchool = schoolsWithMaxRegistrants[4].school_id || null

        const arrayOfMaxSchoolsIds = [firstMaximumschool, secondMaximumSchool, thirdMaximumSchool, fourthMaximumSchool, fifthMaximumSchool]

        //Number of players(learners whose pre_survey is false) from five maximum schools
        const playersFromMaxSchoolsWithPreSurvey = await UserSchool.findAll({
            where: { school_id: { [Op.in]: arrayOfMaxSchoolsIds } },
            attributes: [[sequelize.col('UserSchool.school_id'), 'school_id'],
            [sequelize.fn('COUNT', sequelize.col('UserSchool.school_id')), 'playersWhoArePlaying']],
            group: sequelize.col('UserSchool.school_id'),
            raw: true,
            include: {
                model: User, as: 'useLearner', attributes: [], where: { pre_survey: false }
            },
            subQuery: false, limit: 5, order: [['playersWhoArePlaying', 'DESC']]
        })

        //Number of players(learners whose pre_survey is false and post_survey is true) from five maximum schools
        const playersFromMaxSchoolsWithPostSurvey = await UserSchool.findAll({
            where: { school_id: { [Op.in]: arrayOfMaxSchoolsIds } },
            attributes: [[sequelize.col('UserSchool.school_id'), 'school_id'],
            [sequelize.fn('COUNT', sequelize.col('UserSchool.school_id')), 'playersWhoFinsihedTheGame']],
            group: sequelize.col('UserSchool.school_id'),
            raw: true,
            include: {
                model: User, as: 'useLearner', attributes: [], where: { pre_survey: false, post_survey: false }
            },
            subQuery: false, limit: 5, order: [['playersWhoFinsihedTheGame', 'DESC']]
        })

        //four teachers from each five maximum schools including email address
        const teachersFromMaxSchoolsWithEmail = await School.findAll({
            attributes: schoolAttributes,
            where: { id: { [Op.in]: arrayOfMaxSchoolsIds } },
            include: {
                model: UserSchool, as: "teachers", attributes: userSchoolAttributes,
                include: {
                    model: User, as: "useTeacher", attributes: userAttributes, required: true,
                    include: {
                        model: Role, as: "roles", attributes: [],
                        where: { id: teacherRoleId }
                    }
                }
            },
            subQuery: false
        })

        // const requiredResponse = {
        //     teachersFromMaxSchoolsWithEmail: teachersFromMaxSchoolsWithEmail,
        //     schoolsWithMaxRegistrants: schoolsWithMaxRegistrants,
        //     playersFromMaxSchoolsWithPreSurvey: playersFromMaxSchoolsWithPreSurvey,
        //     playersFromMaxSchoolsWithPostSurvey: playersFromMaxSchoolsWithPostSurvey
        // }

        // const map = teachersFromMaxSchoolsWithEmail.map(i => i.teachers.useTeacher)
        // return res.status(404).send({ status: "success", message: "data found.....", data: map })
        // console.log(map);

        const result = schoolsWithMaxRegistrants.map(v => ({
            ...v, ...teachersFromMaxSchoolsWithEmail.find(sp => sp.name === v.name),
            ...schoolsWithMaxRegistrants.find(sp => sp.school_id === v.school_id),
            ...playersFromMaxSchoolsWithPreSurvey.find(sp => sp.school_id === v.school_id),
            ...playersFromMaxSchoolsWithPostSurvey.find(sp => sp.school_id === v.school_id)
        }));

        // console.log(result);

        if ((schoolsWithMaxRegistrants.length === 0) || (playersFromMaxSchoolsWithPreSurvey.length === 0) || (playersFromMaxSchoolsWithPostSurvey.length === 0) || (teachersFromMaxSchoolsWithEmail.length === 0)) {
            return res.status(404).send({ status: "success", message: "No data found....." })
        }

        return res.status(200).send({ status: "success", message: "The 5 Maximum Schools are:", data: result })

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

//=========================================GET/GET-FIVE-MAX-SCHOOLS=====================================================//

const getFiveMaxSchools = async function (req, res) {
    try {

        let qry1 = `select "schools"."id" as school_id ,Count("schools"."id") as count
        from
            "users"
        left join "user_schools" on "user_schools"."user_id" = "users"."id"
        left join "schools" on "schools"."id" = "user_schools"."school_id"    
        left join "user_grades" on "user_grades"."user_id" = "user_schools"."user_id"    
        where  
            "users"."id"  in (
                select
                    "user_id"
                from
                    "user_roles"
                    inner join "roles" on "user_roles"."role_id" = "roles"."id"
        where "roles"."name" = 'Learner' 
            )             
            and "display_name" != 'Removed User'  GROUP BY schools.id order by count DESC limit 5`
        const schoolWithRegCount = await db.sequelize.query(qry1);
        let qry2 = `select distinct array_agg(email)
        from
            "users"
        left join "user_schools" on "user_schools"."user_id" = "users"."id"
        left join "schools" on "schools"."id" = "user_schools"."school_id"    
        where  
            "users"."id"  in (
                select
                    "user_id"
                from
                    "user_roles"
                    inner join "roles" on "user_roles"."role_id" = "roles"."id"
    where "roles"."name" = 'Teacher' 
            )      
            and "schools"."id"="School"."id"
            and "display_name" != 'Removed User'         
    `;
        let qry3 = `select distinct count("users"."id")
        from
            "users"
        left join "user_schools" on "user_schools"."user_id" = "users"."id"
        left join "schools" on "schools"."id" = "user_schools"."school_id"    
        where  
            "users"."id"  in (
                select
                    "user_id"
                from
                    "user_roles"
                    inner join "roles" on "user_roles"."role_id" = "roles"."id"
        where "roles"."name" = 'Learner' 
            )      
            and "schools"."id"="School"."id"
            and "display_name" != 'Removed User'`;
        const result = await School.findAll({
            where: {
                id: schoolWithRegCount[0].map(i => i.school_id)
            },
            attributes: {
                exclude: ['id', 'contact_number', 'number_of_matric_student', 'total_number_of_student', 'learner_2019', 'educator_2019', 'phase_ped', 'quintile', 'created_at', 'updated_at'],
                include: [
                    [sequelize.literal(`(${qry2})`), "teacher_emails"],
                    [sequelize.literal(`(${qry3})`), "registrants"],
                    [sequelize.literal(`(${qry3 + `and pre_survey='false'`})`), "players"],
                    [sequelize.literal(`(${qry3 + `and post_survey='false'`})`), "players_game_finished"],
                ]
            },
            order: [
                [sequelize.literal('registrants'), 'DESC']
            ],
        })

        return res.status(200).send({ status: "success", message: "The Schools are:", data: result })


    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

//==========================================GET/GET-USER-IN-SCHOOLS-BY-GRADE===========================================//

const getUserInSchoolsByGrade = async function (req, res) {
    try {

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit

        const gradeQuery = (grade) => {
            return `select distinct array_agg(users.id)
             from
            "users"
            left join "user_schools" on "user_schools"."user_id" = "users"."id"
            left join "schools" on "schools"."id" = "user_schools"."school_id"    
            left join "user_grades" on "user_grades"."user_id" = "user_schools"."user_id"   
             where  
            "users"."id"  in (
                select
                    "user_id"
                from
                    "user_roles"
                    inner join "roles" on "user_roles"."role_id" = "roles"."id"
                    inner join "grades" on "user_grades"."grade_id" = "grades"."id"
             where "roles"."name" = 'Learner' and "grades"."name" = 'Grade ${grade}'
            )      
            and "schools"."id"="School"."id"
            and "display_name" != 'Removed User'`
        }

        const result = await School.findAll({
            where: { id: "d442cdf7-b0c9-4562-bde9-a4311bf2ddd5" },
            attributes: {
                exclude: ['id', 'contact_number', 'number_of_matric_student', 'total_number_of_student', 'learner_2019', 'educator_2019', 'phase_ped', 'quintile', 'created_at', 'updated_at'],
                include: [8, 9, 10, 11, 12].map(i => (
                    [sequelize.literal(`(${gradeQuery(i)})`), `users_grade_${i}`]
                )),
            },
            order: [['name', 'ASC']],
            offset: offset, limit: limit
        })

        return res.status(200).send({ status: "success", message: 'All Schools details:', data_count: result.length, data: result })

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};

module.exports = {
    getAllSchools,
    getAllSchoolsByUser,
    getFiveMaximumSchools,
    getFiveMaxSchools,
    getUserInSchoolsByGrade
};
