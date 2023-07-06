const pool = require("../config/db");
const bcrypt = require("bcrypt");

module.exports.getUserByUsername = async function (username) {
  const query = "SELECT * FROM users WHERE username = $1";
  const values = [username];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

module.exports.createUser = async function (user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const query =
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)";
  const values = [user.username, hashedPassword, user.role];

  await pool.query(query, values);
};

module.exports.getAllUsers = async function () {
  const query = "SELECT * FROM users";
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.updateUserRole = async function (userId, newRole) {
  const query = "UPDATE users SET role = $1 WHERE id = $2";
  const values = [newRole, userId];
  await pool.query(query, values);
};

module.exports.updateUserPassword = async function (username, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const query = "UPDATE users SET password = $1 WHERE username = $2";
  const values = [hashedPassword, username];
  await pool.query(query, values);
};

module.exports.comparePasswords = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};
