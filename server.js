const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const db = require("./config/keys").mongoURI;
const path = require("path");
//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to mongo db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongodb successfuly"))
  .catch((err) => console.log(err));

//passport middleware
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport);
// user routs
// require('/confit/passport')(passport)
app.use("/api/posts", posts);
app.use("/api/profile", profile);
app.use("/api/users", users);
// serve static assets if app is in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
