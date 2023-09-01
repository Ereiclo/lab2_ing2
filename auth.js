const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algoritms: ['RS256']
};

const strategy = new JWTStrategy(options, (payload, done) => {
    User.findOne({id: payload.sub})
        .then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null));
});

module.exports = (passport) => {
    passport.use(strategy)
}