module.exports.getHome = function (req, res) {
  const user = req.user;
  const isAdmin = user && user.role === "admin" ? true : false;
  res.render("home", {
    user: user,
    isAdmin: isAdmin,
    isLoggedIn: req.isAuthenticated(),
  });
};
