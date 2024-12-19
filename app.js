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
app.use(session({
  secret: 'd7salls Sndua2',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore()
}));
app.use(flash());
app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/clubs', clubsRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// Function to hash existing plaintext passwords
async function hashExistingPasswords() {
    const users = await db.User.findAll();
    for (const user of users) {
        if (!user.password.startsWith('$2b$')) { // Check if already hashed
            console.log(`Hashing password for user: ${user.username}`);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
        }
    }
    console.log("All existing passwords hashed successfully.");
}

// Sync database and handle initialization
db.sequelize.sync({ force: false }).then(async () => {
    console.log("Database synced successfully!");

    // Populate database (if required)
    const { populateDatabase } = require('./services/PopulationService');
    await populateDatabase();

    // Hash passwords immediately after populating
    await hashExistingPasswords();
});

module.exports = app;