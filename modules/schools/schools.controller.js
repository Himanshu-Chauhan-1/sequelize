const path = require('path');
const db = require(path.resolve('./models/index'));
const School = db.School;
const { Op } = require("sequelize");

//pagination(1 page-10limit),search(name),filters(by quantile q1,q2) in index api
//page,limit,name,filter(quantile)

//========================================GET/GET-ALL-SCHOOLS===============================================================//

const index = async function (req, res) {
    try {

        let data = req.query
        const { name, quintile } = data

        let page = Number(req.query.page) || 0;
        let limit = Number(req.query.limit) || 2000;
        let offset = (page - 1)

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

module.exports = { index }



//schools name(filter), username(search)
//name,email,schools name


