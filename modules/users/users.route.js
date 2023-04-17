const path = require('path');
const express = require('express')
const userRouter = express.Router()
const { getAllUsersByProvince } = require(path.resolve('./modules/users/users.controller'))
const rule = require(path.resolve('./modules/users/users.validator'));


userRouter.get("/api/users", [rule.getAllUsersByProvince, rule.verifyRules], getAllUsersByProvince)

module.exports = userRouter

