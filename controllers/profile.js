const User = require("../models/User");

module.exports.getProfile = function (req, res) {
  const user = req.user;
  const isAdmin = user && user.role === "admin" ? true : false;
  res.render("profile", {
    user: req.user,
    isAdmin: isAdmin,
    isLoggedIn: req.isAuthenticated(),
  });
};

module.exports.getChangePassword = function (req, res) {
  res.render("changePassword", { message: "", messageCorr: "" });
};

module.exports.changePassword = async function (req, res) {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const user = await User.getUserByUsername(username);

    if (!user) {
      res.render("changePassword", { message: "Такого користувача не існує" });
      return;
    }

    if (!User.comparePasswords(oldPassword, user.password)) {
      res.render("changePassword", { message: "Невірний пароль" });
      return;
    }

    if (newPassword.length < 8) {
      res.render("changePassword", { message: "Новий пароль занадто малий" });
      return;
    }

    await User.updateUserPassword(username, newPassword);

    res.render("changePassword", { message: "Пароль успішно змінено" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user password in the database");
  }
};
