const path = require('path');
const express = require('express')
const schoolRouter = express.Router()
const schoolController = require(path.resolve('./modules/schools/schools.controller'))
const rule = require(path.resolve('./modules/schools/schools.validator'));


schoolRouter.post("/api/schools", rule.verifyRules, schoolController.index)


module.exports = schoolRouter



// module.exports = function (router) {

//     //CREATE SPACE
//     router.post("api/spaces", rule.createSpaceRules, rule.verifyRules, spaceController.create)

// }
