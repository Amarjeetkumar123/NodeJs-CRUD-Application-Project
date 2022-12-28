const express = require("express");
const router = express.Router();
const user = require("../models/users");
const multer = require("multer");

// image upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");

// insert an user into database route
router.post("/add", upload, (req, res) => {
  // console.log(req.body);
  const User = new user({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  User.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "user added successfully!",
      };
      res.redirect("/");
    }
  });
});

// Get all users route
router.get("/", (req, res) => {
  user.find().exec((err, users) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", { title: "Home Page", users: users });
    }
  });
});

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

//  Creating Add Users route
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});


module.exports = router;
