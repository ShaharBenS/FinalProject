let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let routes = require('./routes/routes');
let notificationControllers = require('./controllers/notificationsControllers/notificationController');

///
let app = express();

// Connecting to DB
mongoose.connect('mongodb://localhost:27017/Aguda', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);


////////////////
var passport = require('passport');
var session = require('express-session');
app.use(session({
    secret: 's3cr3t',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
////////////////

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
routes(app);


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
    res.render('errorsViews/error');
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// Thread for updating notifications
let updateTimeInMinutes = 10;
setInterval(()=>{
    notificationControllers.updateNotifications();
},updateTimeInMinutes * 60000);

module.exports = app;
