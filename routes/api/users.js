const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const keys = require('../../config/keys');
const User = require('../../models/User');
const router = express.Router();
// @route api/users/test
// @desc tests users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'users works'
}));

// @route api/users/register
// @desc registers users 
// @access public
router.post('/register', (req,res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'email already exists' })
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: 200, // size
          r: 'pg',//pg rating
          d: 'mm' //Default
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
        console.log(newUser.name);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash,
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
          })
        })
      }
    });
});

// @route api/users/login
// @desc login the user /returning JWT token
// @access public
router.post('/login', (req, res) => { 
  const email = req.body.email;
  const password = req.body.password;
  //find the user by email
  User.findOne({email})
    .then(user => {
    //check user
      if (!user) {
        return res.status(404).json({ email: 'user not found' });
      }
      bcrypt.compare(password, user.password) 
        .then((ismatch) => {
          if (ismatch) {
            //user matched
            //sign the token
            const payload = {
              id: user.id,
              name: user.name,
              avatar:user.avatar
            } // create the jwt payload
            jwt.sign(payload,
              keys.secretOrkey,
              { expiresIn: 3600 },
              (err,token) => {
                res.json({
                  success: true,
                  token:'Bearer '+token
                })
            });

          } else {
            return res.status(400).json({ msg: 'password incorrect' });
          }
        });
  })


});
module.exports = router;