module.exports.getLogout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/auth/login");
  });
};
