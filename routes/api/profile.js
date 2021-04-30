const express = require("express");
const mongoose = require("mongoose");
// mongoose.set('useFindAndModify', false);
const passport = require("passport");
const router = express.Router();
//load user model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
const isEmpty = require("../../validation/is-empty");
// @route api/profile/test
// @desc tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "profile works" }));
// @route get api/profile/handle/:handle
// @desc get profile by the handle
// @access public
router.get("/handle/:handle", (req, res) => {
  const erross = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profile = "there is no profile with this handle";
        res.status(404).json(erross);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ error: "querying profile with this id failed" });
    });
});

// @route get api/profile/all
// @desc get all profiles
// @access public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofiles = "there are no profiles";
        res.status(404).json(errors);
      }
      if (isEmpty(profiles)) {
        errors.noprofiles = "there are no profiles";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => {
      res.status(404).json({ error: "getting all profiles failed" });
    });
});
// @route get api/profile/user/:userid
// @desc get profile by user id
// @access public
router.get("/user/:user_id", (req, res) => {
  const erross = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profile = "there is no profile with this user id";
        res.status(404).json(erross);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ error: "querying profile with this id failed" });
    });
});
// @route api/profile/
// @desc get current user profile
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST api/profile/
// @desc create or edit user profile
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const returnedValue = validateProfileInput(req.body);
    const errors = returnedValue.errors;
    const isvalid = returnedValue.isValid;
    if (!isvalid) {
      return res.status(400).json(errors);
    }
    // Get profile fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then((profile) => {
            res.status(200).json(profile);
          })
          .catch((err) => {
            console.log("err", err);
          });
      } else {
        //create
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then((profile) => {
            if (profile) {
              errors.handle = "that handle already exists";
              res.status(400).json(errors);
            }
            //save profile
            new Profile(profileFields)
              .save()
              .then((profile) => {
                console.log("created profile ");
                res.json(profile);
              })
              .catch((err) =>
                res.status(404).json({ error: "failed to save new profile" })
              );
          })
          .catch(
            (err = res
              .status(404)
              .json({ error: "failed to check profile with hanlde" }))
          );
      }
    });
  }
);
// @route POST api/profile/exprience
// @desc to add exprience to profile
// @access private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const returnedValue = validateExperienceInput(req.body);
    const errors = returnedValue.errors;
    const isvalid = returnedValue.isValid;
    // check validation
    if (!isvalid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // add to exerience array of the profile\
      profile.experience.unshift(newExp);
      profile.save().then((profile) => {
        res.json(profile);
      });
    });
  }
);
// @route POST api/profile/education
// @desc to add education to profile
// @access private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const returnedValue = validateEducationInput(req.body);
    const errors = returnedValue.errors;
    const isvalid = returnedValue.isValid;
    // check validation
    if (!isvalid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const neEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // add to exerience array of the profile\
      profile.education.unshift(neEdu);
      profile.save().then((profile) => {
        res.json(profile);
      });
    });
  }
);

// @route DELETE api/profile/exprience/:exp_id
// @desc to delete experience of a profile by id
// @access private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // remove experience from profile
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) =>
        res.status(404).json({ error: "error in deleting an item" })
      );
  }
);
// @route DELETE api/profile/education/:exp_id
// @desc to delete educatoin of a profile by id
// @access private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // remove experience from profile
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu);
        profile.education.splice(removeIndex, 1);
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) =>
        res.status(404).json({ error: "error in deleting an item" })
      );
  }
);
// @route DELETE api/profile
// @desc to delete user and profile profile
// @access private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then((profile) => {
        User.findOneAndRemove({ _id: req.user.id }).then(() => {
          res.json({ success: true });
        });
      })
      .catch((err) =>
        res.status(404).json({ error: "failor to remove profile" })
      );
  }
);
module.exports = router;
