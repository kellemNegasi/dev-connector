const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const keys = require('../../config/keys');
const User = require('../../models/User');
const passport = require("passport");
const { session } = require('passport');
const router = express.Router();
//Load input validation 

const validateRegisterInput = require('../../validation/registor.js');
const validateLogInput = require('../../validation/login.js');
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
  const{errors,isValid} =validateRegisterInput(req.body)
  if(!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email ='email already exists';
        return res.status(400).json({errors })
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
  const{errors,isValid} = validateLogInput(req.body)
  if(!isValid){
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  //find the user by email
  User.findOne({email})
    .then(user => { 
    //check user
      if (!user) {
        errors.email ='user not found'
        return res.status(404).json(errors);
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
            errors.password ='password incorrect';
            return res.status(400).json(errors);
          }
        });
  })


});

// @route api/users/current
// @desc return current user
// @access private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
res.json({
id:req.user.id,
name:req.user.name,
email:req.user.email
});
})
module.exports = router;