const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db = require('./config/keys').mongoURI;
//connect to mongo db
mongoose.
  connect(db,{ useNewUrlParser: true,useUnifiedTopology: true }).
  then(() => console.log('connected to mongodb successfuly'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello world!'));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));

