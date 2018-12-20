var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: "332799736831-mcj8eu9ocjaj89kaasde3j6rf6tugtt8.apps.googleusercontent.com",
        clientSecret: "Iejq6vU5UkiGBEXJdyjm9Wqh",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        let userEmail = profile.emails[0].value;
        let suffixOfEmail = userEmail.split('@')[1];
        console.log(suffixOfEmail);
        if (suffixOfEmail === 'aguda.bgu.ac.il') {
            done(null, profile);
        }
        else {
            done(null, null);
        }
        //User.findOrCreate({userid: profile.id}, {name: profile.displayName, userid: profile.id}, function (err, user) {
        //  return done(err, user);
        //});
    }
));

module.exports = passport;
