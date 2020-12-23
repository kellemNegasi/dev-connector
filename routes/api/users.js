const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
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
router.post('/register', (req, res) => {
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

module.exports = router;