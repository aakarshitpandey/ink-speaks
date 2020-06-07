require('dotenv').config();

const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/user')

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PRIVATE_KEY;

const fbOpts = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['id', 'email', 'first_name', 'last_name', 'middle_name', 'displayName']
    // profileFields: ['id', 'displayName', 'profile_pic', 'email', 'first_name', 'last_name']
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );

    passport.use(
        new FacebookStrategy(fbOpts, async (accessToken, refreshToken, profile, done) => {
            let { emails, name, displayName, id } = profile
            if (emails.length === 0 || !name) {
                //failed login
                return done(null, false)
            } else {
                try {
                    //existing user
                    const user = await User.findOne({ email: emails[0].value })
                    if (user) return done(null, user)
                } catch (e) {
                    done(e, false)
                }
                //create a new account
                if (!displayName) displayName = `${name.givenName} ${name.familyName}`
                let newUser = new User({
                    firstName: name.givenName,
                    lastName: name.familyName,
                    email: emails[0].value,
                    password: '',
                    facebookLogin: {
                        isValid: true,
                        facebookID: id,
                        accessToken: accessToken,
                    }
                })
                //save the user
                try {
                    const savedUser = await newUser.save()
                    return done(null, savedUser)
                } catch (e) {
                    return done(e, false)
                }
            }
        })
    )
};