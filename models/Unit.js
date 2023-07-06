const pool = require("../config/db");

module.exports.getAllUnits = async function () {
  const query = "SELECT * FROM units";
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.getName = async function(unitId){
    const query = "SELECT name FROM units WHERE id = $1";
    const values = [unitId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports.getUnitById = async function (unitId) {
  const query = "SELECT * FROM units WHERE id = $1";
  const values = [unitId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
