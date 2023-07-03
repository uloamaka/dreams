const express = require("express"),
  app = express(),
  flash = require("connect-flash"),
  passport = require("passport"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("./models/user"),
  home = require("./routes/home"),
  about = require("./routes/about_us"),
  blog = require("./routes/blog"),
  contact = require("./routes/contact_us"),
  event = require("./routes/event_service"),
  email = require("./routes/emails"),
  gallery = require("./routes/gallery"),
  login = require("./routes/login"),
  logout = require("./routes/logout"),
  signup = require("./routes/signup");
  methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  require("express-session")({
    secret: "my billions i am coming",
    resave: false,
    saveUninitialized: false,
  })
);
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Middleware to parse JSON data
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// require("dotenv").config();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// mongoose.set("strictQuery", false);
// mongoose
//   .connect("mongodb://127.0.0.1:27017/splendidV8", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("mongoDB connected successfully!"))
//   .catch((err) => console.error("Could not connect to mongoDB", err));

//connect to atlas
const uri =
  "mongodb+srv://dreams:pass5055@dreams.5vef4ul.mongodb.net/?retryWrites=true&w=majority";

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB Atlas");
  });
// app.use(bodyParser.json());
app.use(express.json());
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
  console.log(`Dreams listening on "port : ${port}" ...`);
});


server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;



