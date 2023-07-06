const pool = require("../config/db");

module.exports = function isAdmin(req, res, next) {
  const userId = req.user.id;

  pool.query(
    "SELECT role FROM users WHERE id = $1",
    [userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.rows.length > 0 && result.rows[0].role === "admin") {
        return next();
      } else {
        return res.status(401).send("Unauthorized");
      }
    }
  );
};
