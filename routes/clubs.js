var express = require('express');
var router = express.Router();
var db = require("../models");
var ClubService = require('../services/ClubService');
var clubService = new ClubService(db);
var { checkIfAuthorized } = require("./authMiddlewares");
var { isAdmin } = require("./authMiddlewares");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//Endpoint to display all Clubs
router.get('/', async function (req, res, next) {
  const clubs = await clubService.getAllClubs();
  const userId = req.user?.id ?? 0;
  const userClubs = await clubService.getUserClubIds(userId);
  res.render('clubs', { user: req.user, clubs: clubs, userClubs: userClubs });
});

//Endpoint to display a User's Clubs
router.get('/myclubs', checkIfAuthorized, jsonParser, async function (req, res, next) {
  const userId = req.user?.id ?? 0;
  const userclubs = await clubService.getUserClubs(userId);
  res.render('userClubs', { user: req.user, clubs: userclubs });
});

//Endpoint to display a specific Club's Details
router.get('/:id', checkIfAuthorized, jsonParser, async function (req, res, next) {
  const clubId = req.params.id;
  const club = await clubService.getClubDetails(clubId);
  res.render('clubDetails', { user: req.user, club: club });
});

//Endpoint to join a specific Club
router.post('/join/:id', checkIfAuthorized, jsonParser, async function (req, res, next) {
  const clubId = req.params.id;
  const userId = req.user.id;
  await clubService.joinClub(clubId, userId);
  const clubs = await clubService.getAllClubs();
  const clubIds = await clubService.getUserClubIds(userId);
  res.render('clubs', { user: req.user, clubs: clubs, userClubs: clubIds });
});

//Admin Endpoint for Club maintenance
// router.get('/clubMaintenance', checkIfAuthorized, jsonParser, async function (req, res, next) {
//   const allClubs = await clubService.getAllClubs();
//   res.render('clubMaintenance', { user: req.user, clubs: allClubs });
// });

//Admin Endpoint for adding a new Club
router.post('/add', isAdmin, async function (req, res, next) {
  await clubService.addClub(name, description, dateCreated);
  res.redirect('/clubs');
})
module.exports = router;