let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let userAccessor = require("../models/accessors/usersAccessor.js");

let indexUsers = 0;
let myUsers = [];
let _init = false;

userAccessor.findUsernames((err, res) => {
    for (let i = 0; i < res.length; i++) {
        myUsers.push([res[i].userEmail, res[i].userName]);
    }
    _init = true;
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(">>> message2");
        console.log("index: " + indexUsers + " | username: " + myUsers[indexUsers][0] + " | email: " + myUsers[indexUsers][1]);
        myAns = {
            username: myUsers[indexUsers][1],
            password: 'im not your toy',
            displayName: 'you stupid boy',
            emails: [{value: myUsers[indexUsers][0]}]
        };
        indexUsers = indexUsers + 1;
        return done(null, myAns);
    }
));

module.exports = passport;