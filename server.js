const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const db = require('./config/keys').mongoURI;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to mongo db
mongoose.
  connect(db,{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false }).
  then(() => console.log('connected to mongodb successfuly'))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport)
// user routs
// require('/confit/passport')(passport)
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));

