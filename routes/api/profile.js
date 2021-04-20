const express = require('express');
const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);
const passport = require('passport');
const router = express.Router();
//load user model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// load validation 
const validateProfileInput = require('../../validation/profile');
// @route api/profile/test
// @desc tests profile route
// @access Public 
router.get('/test', (req, res) => res.json({ msg: "profile works" }));
// @route api/profile/
// @desc get current user profile
// @access private 
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    errors ={};
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile){
            errors.noprofile ="There is no profile for this user"
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err=>res.status(404).json(err));
})

// @route POST api/profile/
// @desc create or edit user profile
// @access private
router.post('/',passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const returnedValue = validateProfileInput(req.body);
    const errors = returnedValue.errors;
    const isvalid = returnedValue.isValid
    if (!isvalid) {
        return res.status(400).json(errors)
    }
    // Get profile fields
    const profileFields ={}
    profileFields.user= req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.handle;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // skills - split into array
    if(typeof req.body.skills!== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }
    // social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            //update
            Profile.findOneAndUpdate({handle: profileFields.handle }, { $set: profileFields }, { new: true })
                .then(profile => {
                    console.log('updated the profile', profile);
                    res.status(200).json(profile);
                }).catch(err => {
                    console.log("err", err);
            })
        }
        else{
            //create
            //check if handle exists
            Profile.findOne({handle:profileFields.handle})
            .then(profile=>{
                if(profile){
                    errors.handle = "that handle already exists"
                    res.status(400).json(errors);
                }
                //save profile
                new Profile(profileFields).save()
                .then(
                    profile => {
                        console.log("created profile ",profile)
                        res.json(profile)
                    });
            });
        }
    })
});
module.exports = router;