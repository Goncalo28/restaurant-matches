require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

// Passport-facebook 
const FacebookStrategy = require('passport-facebook').Strategy;

mongoose
  .connect('mongodb://localhost/restaurant-matches', {useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

//Session setup (to save session on DB if we want)

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     store: new MongoStore({
//       mongooseConnection: mongoose.connection
//     }),
//     resave: true,
//     saveUninitialized: false // <== false if you don't want to save empty session object to the store
//   })
// );

// session set up
app.use(
  session({
    secret: 'secret', 
    cookie: {maxAge: 60000},
    rolling: true
  })
)

//Passport setup
passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
 
//local strategy
passport.use(
  new LocalStrategy(
    // { passReqToCallback: true }, THIS IS BREAKING THE LOGIN FOR SOME REASON
    {
      usernameField: 'username', // by default
      passwordField: 'password' // by default
    },
    (username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { errorMessage: 'Incorrect username' });
          }
 
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { errorMessage: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

// facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ facebookID: profile.id }, 
    (err, user) => {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

app.use(passport.initialize());
app.use(passport.session());



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const login = require('./routes/login');
app.use('/', login);

const signup = require('./routes/signup');
app.use('/', signup);

const api = require('./routes/api');
app.use('/', api);

module.exports = app;
