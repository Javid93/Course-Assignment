var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bcrypt = require('bcrypt'); 



passport.use(new LocalStrategy(function verify(username, password, cb) {
  userService.getOneByName(username).then((data) => {
    if (data === null) {
      return cb(null, false, { message: 'Wrong username or password!' });
    }

    bcrypt.compare(password, data.password, (err, isMatch) => {
      if (err) return cb(err);
      if (!isMatch) {
        return cb(null, false, { message: 'Wrong username or password!' });
      }
      return cb(null, data);
    });
  }).catch(err => cb(err));
}));


passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, email: user.email, role: user.role});
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user, message: req.flash('error') });
});
router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.'
}));

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', async function(req, res, next) {
  const fullName = `${req.body.firstname} ${req.body.lastname}`;
  try{
    await userService.create(fullName, req.body.username, req.body.password, req.body.email, req.body.ssn, req.body.gender, req.body.religion, "student");
    res.redirect('/login');
  }catch(error){
    req.flash('error', error);
    res.render('signup', {message: req.flash('error')});
  }
});

module.exports = router;