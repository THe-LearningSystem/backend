var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var passport = require('passport');
var config = require('./config'),
    User = require('./api/users/models/users.model');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.jwt.secret;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.user._id, function (err, user) {
        if (err) {
            console.log(err);
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            console.log("asd");
            done(null, false);
        }
    });
}));