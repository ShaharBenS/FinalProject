let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let usersAndRoles = require("../models/schemas/usersSchemas/UserNamesSchema.js");


passport.use(new LocalStrategy(
    function (username, password, done) {
        usersAndRoles.aggregate([{$sample: {size: 1}}], (err, user) => {
            console.log("username: " + user[0].userName + " | email: " + user[0].userEmail);
            return done(null, {
                username: user[0].userName,
                password: 'im not your toy',
                displayName: 'you stupid boy',
                emails: [{value: user[0].userEmail}]
            });
        });
    }
));

module.exports = passport;