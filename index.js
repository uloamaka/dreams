require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const home = require("./routes/home");
const about = require("./routes/about_us");
const blog = require("./routes/blog");
const contact = require("./routes/contact_us");
const event = require("./routes/event_service");
const email = require("./routes/emails");
const gallery = require("./routes/gallery");
const login = require("./routes/login");
const logout = require("./routes/logout");
const signup = require("./routes/signup");
const cors = require("cors");
const session = require("express-session");

app.set("trust proxy", 1); // trust first proxy
app.use(cors({ origin: "http://localhost:3000" }));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "s3Cur3",
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Connect to MongoDB Atlas
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

app.use("/", home);
app.use("/about", about);
app.use("/blogs", blog);
app.use("/contact", contact);
app.use("/event", event);
app.use("/subscribe", email);
app.use("/gallery", gallery);
app.use("/login", login);
app.use("/logout", logout);
app.use("/signup", signup);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Dreams listening on "port: ${port}"...`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
