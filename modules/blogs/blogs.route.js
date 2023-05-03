const path = require('path');
const express = require('express')
const blogRouter = express.Router()
const { getAllBlogs, getBlogsByUser } = require(path.resolve('./modules/blogs/blogs.controller'))
const rule = require(path.resolve('./modules/blogs/blogs.validator'));


blogRouter.get("/api/blogs", [rule.getAllBlogs, rule.verifyRules], getAllBlogs)
blogRouter.get("/api/blogs/reactions", getBlogsByUser)

module.exports = blogRouter 