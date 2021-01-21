const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

// TODO: Test these two functions and see if they work,
// TODO: Work on client integration

/**
 * Registers a new user
 */
const signup = async (req, res) => {
    let user = await new User();

    user.username = req.body.username;
    user.email = req.body.email;
    let hashedPassword = bcrypt.hash(req.body.password, 10, function (err, hash){
        if (err) {
            console.error(err)
            return
        }    
    })
    user.password = hashedPassword;

    await user.save((savedUser, err) => {
        if(err) return res.status(500).send({ error: err, message:  'There was a problem registering user' });

        let token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXP }
        );

        return res.status(200).send({ auth: true, token: token });
    })
}

/**
 * Logs a registered user in
 */
const login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username.includes('@')) {
        User.findOne({ email: username }, (foundUser, err) =>{
            if (err) return res.status(500).send({ error: err, message: 'Server error unable to login, please try agian' });
            if (!foundUser) return res.status(404).send({ error: err, message: 'User not registered, please sign up' });

            let validPass = bcrypt.compareSync(password, foundUser.password);
            if(!validPass) return res.status(401).send({ error: err, message: 'Wrong username and/or password', auth: false });

            let token = jwt.sign(
                { userId: foundUser._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXP }
            );
            
            return res.status(200).send({ auth: true, token })
        })
    }

    User.findOne({ username: username }, (foundUser, err) =>{
        if (err) return res.status(500).send({ error: err, message: 'Server error unable to login, please try agian' });
        if (!foundUser) return res.status(404).send({ error: err, message: 'User not registered, please sign up' });

        let validPass = bcrypt.compareSync(password, foundUser.password);
        if(!validPass) return res.status(401).send({ error: err, message: 'Wrong username and/or password', auth: false });

        let token = jwt.sign(
            { userId: foundUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXP }
        );
        
        return res.status(200).send({ auth: true, token })
    })
}

export default {
    signup,
    login
}