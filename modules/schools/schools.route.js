const path = require('path');
const express = require('express')
const schoolRouter = express.Router()
const schoolController = require(path.resolve('./modules/schools/schools.controller'))
const rule = require(path.resolve('./modules/schools/schools.validator'));


schoolRouter.get("/api/schools", [rule.getAllSchools], schoolController.index)

module.exports = schoolRouter

