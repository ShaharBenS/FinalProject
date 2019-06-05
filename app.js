let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let routes = require('./routes/routes');
let notificationControllers = require('./controllers/notificationsControllers/notificationController');
let activeProcessControllers = require('./controllers/processesControllers/activeProcessController');
let onlineFormsController = require('./controllers/onlineFormsControllers/onlineFormController');
let locks = require('locks');
let AutoUpdater = require('auto-updater');

let autoupdater = new AutoUpdater({
    pathToJson: '',
    autoupdate: true,
    checkgit: true,
    jsonhost: 'raw.githubusercontent.com',
    contenthost: 'codeload.github.com',
    progressDebounce: 0,
    devmode: false
});

// State the events
autoupdater.on('git-clone', function() {
    console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
});
autoupdater.on('check.up-to-date', function(v) {
    console.info("You have the latest version: " + v);
});
autoupdater.on('check.out-dated', function(v_old, v) {
    console.warn("Your version is outdated. " + v_old + " of " + v);
    autoupdater.fire('download-update'); // If autoupdate: false, you'll have to do this manually.
    // Maybe ask if the'd like to download the update.
});
autoupdater.on('update.downloaded', function() {
    console.log("Update downloaded and ready for install");
    autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.not-installed', function() {
    console.log("The Update was already in your folder! It's read for install");
    autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.extracted', function() {
    console.log("Update extracted successfully!");
    console.warn("RESTART THE APP!");
});
autoupdater.on('download.start', function(name) {
    console.log("Starting downloading: " + name);
});
autoupdater.on('download.progress', function(name, perc) {
    process.stdout.write("Downloading " + perc + "% \033[0G");
});
autoupdater.on('download.end', function(name) {
    console.log("Downloaded " + name);
});
autoupdater.on('download.error', function(err) {
    console.error("Error when downloading: " + err);
});
autoupdater.on('end', function() {
    console.log("The app is ready to function");
});
autoupdater.on('error', function(name, e) {
    console.error(name, e);
});

// Start checking
autoupdater.fire('check');
/*
    Tomer+kuti = Love
 */

///
let app = express();

let argv = process.argv;
let dbName = "Aguda";
// Connecting to DB
if (argv.length >= 3 && argv[2].toLowerCase() === "test")
    dbName = "Tests";

mongoose.connect('mongodb://localhost:27017/' + dbName, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);


////////////////
var passport = require('passport');
var session = require('express-session');
app.use(session({
    secret: 's3cr3t',
    resave: false,
    saveUninitialized: false
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
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
let count = 0;
let mutex = locks.createMutex();
app.use((req,res,next)=>{
    mutex.lock(function () {
        res.on("finish",()=>{
            mutex.unlock();
        });
        next();
    });
});

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

onlineFormsController.createAllOnlineForms(() => {
});

// Thread for updating notifications
let updateTimeInMinutes = 15;
setInterval(()=>{
    notificationControllers.updateNotifications(()=>{});
},updateTimeInMinutes * 60000);

//Thread for automatic advance
setInterval(()=>{
    activeProcessControllers.advanceProcessesIfTimeHasPassed(()=>{});
},updateTimeInMinutes * 60000);

module.exports = app;
