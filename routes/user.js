var express = require('express');
var router = express.Router();
var db = require("../models");
var UserService = require('../services/UserService');
var userService = new UserService(db);
var { checkIfAuthorized } = require("./authMiddlewares");
var bodyParser = require('body-parser');
const ClubService = require('../services/ClubService');
var jsonParser = bodyParser.json();


router.get('/:id', checkIfAuthorized, jsonParser, async function (req, res, next) {
  	const userId = req.params.id;
	const userDetails = await userService.getUserDetails(userId);
	res.render('userDetails', { user: req.user, userDetails: userDetails});
});

module.exports = router;