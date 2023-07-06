const pool = require("../config/db");

module.exports.getAllResults = async function () {
  const query = "SELECT * FROM results";
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.createResult = async function (result) {
  const query = "INSERT INTO results (sername, name, date, score, unit_id) VALUES ($1, $2, $3, $4, $5)";
  const values = [result.sername, result.name, result.date, result.score, result.unit_id];
  await pool.query(query, values);
};

module.exports.getResultById = async function (resultId) {
  const query = "SELECT * FROM results WHERE id = $1";
  const values = [resultId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports.updateResult = async function (resultId, sername, name, date, score) {
  const query = "UPDATE results SET sername = $1, name = $2, date = $3, score = $4 WHERE id = $5";
  const values = [sername, name, date, score, resultId];
  await pool.query(query, values);
};

module.exports.deleteResultById = async function (id) {
  await pool.query("DELETE FROM results WHERE id = $1", [id]);
};

module.exports.sortResults = async function (sortBy = "name", sortOrder = "asc") {
  const query = `SELECT * FROM results ORDER BY ${sortBy} ${sortOrder}`;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.searchResults = async function (sername) {
  const query = "SELECT * FROM results WHERE sername ILIKE $1";
  const values = [`%${sername}%`];
  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports.getResultsByUnit = async function (unitId) {
  const query = "SELECT * FROM results WHERE unit_id = $1";
  const values = [unitId];
  const { rows } = await pool.query(query, values);
  return rows;
};
