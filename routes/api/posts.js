const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post')
// @route POST api/posts
// @desc create post
// @access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const returnedValue = validatePostInput(req.body);
  const errors = returnedValue.errors;
  const isvalid = returnedValue.isValid
  if (!isvalid) {
    return res.status(400).json(errors)
  }
  const NewPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  NewPost.save().then(post => res.json(post)).catch(err => res.status(404).json({ error: "failed to save the post" }));

});

// @route GET api/posts
// @desc get all posts
// @access public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts)).catch(err => res.status(404).json({ error: "failed to retrieve all posts" }));
})
// @route GET api/posts/:id
// @desc get a single post
// @access public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ postnotfound: "no post with that id" });
      }
      res.json(post)
    })
    .catch(err => res.status(404).json({ error: "failed to retrieve a post by the given id" }));
})
// @route DELETe api/posts/:id
// @desc delete a post by id
// @access private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            res.status(404).json({ unauthorized: "anauthorized user" })
          }
          post.remove().then(() => res.json({ success: true }));
          
        }).catch(err => res.status(404).json({ postnotfound: "post not found" }));
    }).catch(err => res.status(404).json({ profilenotfound: "profile not found" }));
});
// @route POST api/posts/like/:id
// @desc like a post
// @access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({alreadylike:"user already liked this post"})
          }
          // else add the user to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post)).catch(err => res.status(404).json({ savingfaild: "failed to save the like to database" }));
        }).catch(err => res.status(404).json({ postnotfound: "post not found" }));
    }).catch(err => res.status(404).json({ profilenotfound: "profile not found" }));
});
// @route POST api/posts/unlike/:id
// @desc like a post
// @access private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: "you have not liked this post" });
          }
          else {
            // get the remove index
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
            //save the change to database
            post.save().
              then(post => res.json(post))
              .catch(err => res.status(404).json({ error: 'saving error' }));
          }

        }).catch(err => res.status(404).json({ postnotfound: "post not found" }));
    }).catch(err => res.status(404).json({ profilenotfound: "profile not found" }));
});

// @route POST api/posts/comment/:id
// @desc comment on  a post
// @access private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const returnedValue = validatePostInput(req.body);
  const errors = returnedValue.errors;
  const isvalid = returnedValue.isValid
  if (!isvalid) {
    return res.status(400).json(errors)
  }
  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      // Add to comments array

      post.comments.unshift(newComment);
      // save
      post.save()
        .then(post => res.json(post))
    }).catch(err => res.status(404).json({ postnotfoune: "post not found" }));
});

// @route Delet api/posts/comment/:id/:/comment_id
// @desc delete a comment
// @access private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // check to see if the comment exists
      if (post.comments.filter(comment => comment._id.toString()===req.params.comment_id).length===0) {
        return res.status(404).json({ commentnotexist: "comment does not exist" });
      }
      const removeIndex = post.comments.map(item => item._id.toString)
        .indexOf(req.params.comment_id);
      // splice the comment from the array
      post.comments.splice(removeIndex, 1);
      // save
      post.save()
        .then(post => res.json(post))
    }).catch(err => res.status(404).json({ postnotfoune: "post not found" }));
});
module.exports = router;