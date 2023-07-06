const User = require("../models/User");

module.exports.getLogin = function (req, res) {
  res.render("login", { message: req.flash("error"), attempts: "" });
};

module.exports.login = async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
};

module.exports.getRegister = function (req, res) {
  const user = req.user;
  const isAdmin = user && user.role === "admin" ? true : false;
  res.render("registration", {
    message: "",
    user: user,
    isAdmin: isAdmin,
    isLoggedIn: req.isAuthenticated(),
  });
};

module.exports.register = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let role = req.body.role;

  try {
    const userExists = await User.getUserByUsername(username);

    if (userExists) {
      res.render("registration", { message: "Такий користувач вже існує!" });
      return;
    }

    if (password.length < 8) {
      res.render("registration", { message: "Пароль занадто малий!" });
      return;
    }

    const newUser = {
      username: username,
      password: password,
      role: role || "user",
    };

    await User.createUser(newUser);

    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user to database");
  }
};

module.exports.getRole = async function (req, res) {
  try {
    const users = await User.getAllUsers();
    res.render("usersRoles", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
};

module.exports.changeRole = async function (req, res) {
  const userId = req.params.id;
  const newRole = req.body.role;

  try {
    await User.updateUserRole(userId, newRole);
    res.redirect("/auth/changeRole");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
