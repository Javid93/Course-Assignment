var express = require('express');
var router = express.Router();
var db = require("../models");
var ClubService = require('../services/ClubService');
var clubService = new ClubService(db);
var { checkIfAuthorized } = require("./authMiddlewares");
var { isAdmin } = require("./authMiddlewares");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//Admin Endpoint for Club maintenance
router.get('/', checkIfAuthorized, jsonParser, async function (req, res, next) {
  const allClubs = await clubService.getAllClubs();
  res.render('clubMaintenance', { user: req.user, clubs: allClubs });
});

//Admin Endpoint for adding a new Club
router.post('/addClub', isAdmin, async function (req, res, next) {
  const clubName = req.body.clubName;
  const clubDescription = req.body.clubDescription;
  const dateCreated = req.body.createdDate;
  await clubService.addClub(clubName, clubDescription, dateCreated);
  res.redirect('/clubs');
})

//Admin Endpoint for deleting a Club
router.post('/deleteClub', checkIfAuthorized, async function (req, res, next) {
  const clubId = req.body.clubId;
  await clubService.deleteClub(clubId);
  res.redirect('/clubs');
})
module.exports = router;