const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

// TODO: Work on client integration

/**
 * Registers a new user
 */
const signup = async (req, res) => {
    let user = await new User();

    user.username = req.body.username;
    user.email = req.body.email;
    bcrypt.hash(req.body.password, 10, async function (err, hash){
        if (err) return console.error(err);
        
        user.password = hash;

        await user.save()
            .then(savedUser => {

                let token = jwt.sign(
                    { userId: savedUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXP }
                );
        
                return res.status(200).send({ auth: true, token: token });
            })
            .catch(err => {
                return res.status(500).send({ error: err, message:  'There was a problem registering user' });
            });
    })


}

/**
 * Logs a registered user in
 */
const login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log('BODY', req.body)

    if(username.includes('@')) {
        await User.findOne({ email: username }, function (err, foundUser) {
            if (err) return res.status(500).send({ error: err, message: 'Server error unable to login email, please try again' });
            if (!foundUser) return res.status(404).send({ error: err, message: 'User not registered, please sign up' });
    
            bcrypt.compare(password, foundUser.password, function(err) {
                if(err) return res.status(401).send({ error: err, message: 'Wrong username and/or password', auth: false });

                let token = jwt.sign(
                    { userId: foundUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXP }
                );
                
                return res.status(200).send({ auth: true, token })
            })
        })
    }

    if(!username.includes('@')) {
        await User.findOne({ username: username }, function (err, foundUser) {
            if (err) return res.status(500).send({ error: err, message: 'Server error unable to login with username, please try again' });
            if (!foundUser) return res.status(404).send({ error: err, message: 'User not registered, please sign up' });
    
            bcrypt.compare(password, foundUser.password, function(err) {
                if(err) return res.status(401).send({ error: err, message: 'Wrong username and/or password', auth: false });
    
                let token = jwt.sign(
                    { userId: foundUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXP }
                );
                
                return res.status(200).send({ auth: true, token })
            });
        })
    }
}

module.exports = {
    signup,
    login
}