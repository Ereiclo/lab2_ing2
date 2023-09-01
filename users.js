const router = require('express').Router();
const passport = require('passport');
const utils = require('./utils');

router.get('/protected', (req, res, next) => {

})

router.post('/login', function(req, res, next){

});

router.post('/register', function(req, res, next){
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
    })

    newUser.save()
        .then((user)=>{

            const id = user._id;

            const jwt = utils.issueJWT(user);

            res.json({success: True, user: user});
        })
        .catch(err => next(err));

});

module.exports = router