const express = require("express");
const controller = require("../controllers/auth");
const { check } = require("express-validator");
const router = express.Router();
const passport = require('passport')

router.get("/login", controller.getLogin);

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true, 
  }),
  controller.login
);


router.get("/register", controller.getRegister);
router.post("/register", controller.register);

router.get('/changeRole', controller.getRole)
router.post('/changeRole/:id', controller.changeRole)


module.exports = router;
