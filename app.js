require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var flash = require('connect-flash');

var db = require("./models");


const bcrypt = require('bcrypt');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var clubsRouter = require('./routes/clubs');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

db.sequelize.sync({ force: false }).then(() =>{
  require('./services/PopulationService.js');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
      secret: 'd7salls Sndua2',
      resave: false,
      saveUninitialized: false,
      store: new SQLiteStore(),
      cookie: {
        maxAge: 1 * 60 * 1000, // 15 minutes

      },
  })
);


app.use(flash());
app.use(passport.authenticate('session'));

app.use((req, res, next) => {
  if (req.session) {
      const now = Date.now();
      const sessionExpiry = req.session.cookie._expires || req.session.cookie.maxAge + now;

      if (sessionExpiry < now) {
          req.logout(function (err) {
              if (err) {
                  return next(err);
              }
              return res.redirect('/login');
          });
      }
  }
  next();
});


app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/clubs', clubsRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

db.sequelize.sync({ force: false }).then(async () => {
  const { populateDatabase } = require('./services/PopulationService');
  await populateDatabase();

});


module.exports = app;