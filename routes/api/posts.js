const express = require('express');
const router = express.Router();
// @route api/posts/test
// @desc tests post route
// @access Public 

router.get('/test', (req, res) => res.json({
  msg: 'posts works'
}));
module.exports = router;