const path = require('path');
const express = require('express')
const schoolRouter = express.Router()
const { getAllSchools, getAllSchoolsByUser, getAllSchoolsByLearner } = require(path.resolve('./modules/schools/schools.controller'))
const rule = require(path.resolve('./modules/schools/schools.validator'));


schoolRouter.get("/api/schools", [rule.getAllSchools, rule.verifyRules], getAllSchools)
schoolRouter.get("/api/schools/users", [rule.getAllSchoolsByUser, rule.verifyRules], getAllSchoolsByUser)
schoolRouter.get("/api/schools/learners", getAllSchoolsByLearner)

module.exports = schoolRouter

