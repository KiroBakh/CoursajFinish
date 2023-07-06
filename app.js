const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const flash = require("connect-flash");
require("./config/passport-config")(passport);
const sessioN = require('./config/session')

const authRoutes = require("./routes/auth");
const resultsRoutes = require("./routes/results");
const homeRoutes = require("./routes/home");
const profileRoutes = require("./routes/profile");
const logoutRoutes = require("./routes/logout");

const app = express();

app.use("/public", express.static("public"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(cors());
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sessioN);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeRoutes);

app.use("/results", resultsRoutes);

app.use("/auth", authRoutes);

app.use("/profile", profileRoutes);

app.use("/logout", logoutRoutes);

module.exports = app;
