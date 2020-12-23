const express = require('express');
const mongoose = require('mongoose');
const app = express();
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const db = require('./config/keys').mongoURI;
//connect to mongo db
mongoose.
  connect(db,{ useNewUrlParser: true,useUnifiedTopology: true }).
  then(() => console.log('connected to mongodb successfuly'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello world!'));

// user routs

app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));

