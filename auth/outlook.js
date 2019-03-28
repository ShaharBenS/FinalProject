var passport = require('passport');
var OutlookStrategy = require('passport-outlook').Strategy;

passport.use(new OutlookStrategy({
        clientID: "ba13fb4b-878c-4d71-a5eb-f68305542676",
        clientSecret: "vqACHBJKZ69!zzcho429];#",
        callbackURL: 'http://localhost:3000/auth/outlook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
        var user = {
            outlookId: profile.id,
            name: profile.DisplayName,
            email: profile.EmailAddress,
            accessToken:  accessToken
        };
        if (refreshToken)
            user.refreshToken = refreshToken;
        if (profile.MailboxGuid)
            user.mailboxGuid = profile.MailboxGuid;
        if (profile.Alias)
            user.alias = profile.Alias;
        User.findOrCreate(user, function (err, user) {
            return done(err, user);
        });
    }
));

module.exports = passport;