const path = require('path');
const db = require(path.resolve('./models/index'));
const Blog = db.Blog
const { Op } = require("sequelize");

//========================================GET/GET-ALL-BLOGS===============================================================//

const getAllBlogs = async function (req, res) {
    try {

        let data = req.query
        const { title, description } = data

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) ? Number(req.query.limit) : 10;
        let offset = (page - 1) * limit

        let blogAttributes = ['id', 'title', 'description', 'posted_by', 'space_id', 'user_id', 'header_image_id', 'audience_type', 'content_type']

        if (Object.keys(data).length > 0) {

            let findBlogsByFilter = await Blog.findAll({
                attributes: blogAttributes,
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${title}%` } },
                        { description: { [Op.iLike]: `%${description}%` } },
                    ],
                },
                $sort: { id: 1 }, offset: offset, limit: limit
            })

            if (!findBlogsByFilter.length)
                return res.status(404).send({ status: "success", message: "No Blogs found as per the filters applied" })

            return res.status(200).send({ status: "success", message: "Blogs as per the filters applied:", blogs_count: findBlogsByFilter.length, data: findBlogsByFilter })
        } else {

            const blogData = await Blog.findAll({ attributes: blogAttributes })

            if (blogData.length === 0) {
                return res.status(422).send({ status: "success", message: "No Blogs Found....." });
            }
            return res.status(200).send({ status: "success", message: 'All Blogs details:', blogs_count: blogData.length, data: blogData })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: "error", msg: "Something went wrong Please check back again" })
    }
};


module.exports = { getAllBlogs }