const path = require('path');
const express = require('express')
const spaceRouter = express.Router()
const spaceController = require(path.resolve('./modules/spaces/spaces.controller'))
const rule = require(path.resolve('./modules/spaces/spaces.validator'));


spaceRouter.post("/api/spaces", rule.createSpaceRules, rule.verifyRules, spaceController.create)


module.exports = spaceRouter



// module.exports = function (router) {

//     //CREATE SPACE
//     router.post("api/spaces", rule.createSpaceRules, rule.verifyRules, spaceController.create)

// }
