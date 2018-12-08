var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var addRoleRouter = require('./routes/addRole')
var deleteRoleRouter = require('./routes/deleteRole');
var editRoleRouter = require('./routes/editRole');
var addUserRouter = require('./routes/addUser');
var deleteUserByEmailRouter = require('./routes/deleteUserByEmail');
var deleteUserByRoleRouter = require('./routes/deleteUserByRole');
var editUserEmailRouter = require('./routes/editUserEmail');
var editUserRoleRouter = require('./routes/editUserRole');
var addNewRoleRouter = require('./routes/addNewRole');
var deleteRoleRouter = require('./routes/deleteRole');


var app = express();


//Setting up schemas
mongoose.connect('mongodb://localhost:27017/Aguda',{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var PS = require("./schemas/ProcessStructure");
var UAR = require("./schemas/UsersAndRoles");
var U = require("./schemas/User");
var X = require("./schemas/Roles");

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
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/addRole', addRoleRouter);
app.use('/deleteRole', deleteRoleRouter);
app.use('/editRole', editRoleRouter);
app.use('/addUser', addUserRouter);
app.use('/deleteUserByEmail', deleteUserByEmailRouter);
app.use('/deleteUserByRole', deleteUserByRoleRouter);
app.use('/editUserEmail', editUserEmailRouter);
app.use('/editUserRole', editUserRoleRouter);
app.use('/addNewRole', addNewRoleRouter);
app.use('/deleteRole', deleteRoleRouter);


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


module.exports = app;
