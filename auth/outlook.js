let usersAccessor = require('../models/accessors/usersAccessor');
let passport = require('passport');
let OutlookStrategy = require('passport-outlook').Strategy;

passport.use(new OutlookStrategy({
        clientID: "ba13fb4b-878c-4d71-a5eb-f68305542676",
        clientSecret: "vqACHBJKZ69!zzcho429];#",
        callbackURL: 'http://localhost:3000/auth/outlook/callback'
    },
    function (accessToken, refreshToken, profile, done)
    {
        usersAccessor.findInSankeyTree({}, (err, _sankeyTree) =>
        {
            if (_sankeyTree[0] === undefined ||_sankeyTree[0].sankey === "{\"content\":{\"diagram\":[]}}") {
                done(null, profile);
            }
            else {
                let email = profile.emails[0].value;
                usersAccessor.findUsername({userEmail: email}, (err, result) =>
                {
                    if (err) {
                        done(null, null);
                    }
                    else if (result.length === 0) {
                        done(null, null);
                    }
                    else {
                        done(null, profile);
                    }
                });
            }
        });
    }
));

module.exports = passport;