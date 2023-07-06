const Result = require("../models/Result");
const Unit = require("../models/Unit");

const ITEMS_PER_PAGE = 5;

module.exports.getAll = async function (req, res) {
  const page = parseInt(req.query.page) || 1;

  try {
    const units = await Unit.getAllUnits(); 
    const selectedUnit = req.query.unit; 
    const results = selectedUnit
      ? await Result.getResultsByUnit(selectedUnit)
      : await Result.getAllResults();

    const user = req.user;
    const isAdmin = user && user.role === "admin";
    const isLoggedIn = req.isAuthenticated();
    const currentPage = parseInt(req.query.page) || 1;
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const paginatedResults = results.slice(offset, offset + ITEMS_PER_PAGE);

    res.render("results", {
      selectedUnit: selectedUnit, 
      units: units,
      results: paginatedResults,
      isAdmin: isAdmin,
      isLoggedIn: isLoggedIn,
      currentPage: currentPage,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving results from the database");
  }
};




module.exports.getResultsByUnit = async function (req, res) {
  const unitId = req.params.id; 
  const page = parseInt(req.query.page) || 1;

  try {
    const units = await Unit.getAllUnits(); 
    const results = await Result.getResultsByUnit(unitId);

    const user = req.user;
    const isAdmin = user && user.role === "admin";
    const isLoggedIn = req.isAuthenticated();
    const currentPage = parseInt(req.query.page) || 1;
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const unit = await Unit.getName(unitId);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const paginatedResults = results.slice(offset, offset + ITEMS_PER_PAGE);

    res.render("results", {
      selectedUnit: unit.name,
      results: paginatedResults,
      units: units,
      isAdmin: isAdmin,
      isLoggedIn: isLoggedIn,
      currentPage: currentPage,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving results from the database");
  }
};


module.exports.getCreate = async function (req, res) {
  const units = await Unit.getAllUnits();
  res.render("create", { units: units });
};

module.exports.createResult = async function (req, res) {
  const { sername, name, date, score, unit } = req.body;

  try {
    const newResult = {
      sername: sername,
      name: name,
      date: date,
      score: score,
      unit_id: unit, // Используем выбранное подразделение
    };

    await Result.createResult(newResult);

    res.redirect("/results");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding result to the database");
  }
};


module.exports.getUpdate = async function (req, res) {
  const id = req.params.id;
  try {
    const result = await Result.getResultById(id);
    res.render("update", { result });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Error retrieving result." });
  }
};

module.exports.updateResult = async function (req, res) {
  const resultId = req.params.id;
  const { sername, name, date, score } = req.body;

  try {
    await Result.updateResult(resultId, sername, name, date, score);
    res.redirect("/results");
  } catch (err) {
    console.error(err);
res.status(500).send("Error updating result in the database");
  }
};

module.exports.deleteResult = async function (req, res) {
  const resultId = req.params.id;
  try {
    await Result.deleteResultById(resultId);
    console.log(`Record with id ${resultId} deleted successfully`);
    res.redirect("/results");
  } catch (err) {
    console.error("Error deleting result", err);
    res.status(500).send("Error deleting result from the database");
  }
};

module.exports.sort = async function (req, res) {
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  try {
    const users = await Result.sortResults(sortBy, sortOrder);
    const user = req.user;
    const isAdmin = user && user.role === "admin";
    res.render("sort", {
      users,
      sortBy,
      sortOrder,
      user,
      isAdmin,
      isLoggedIn: req.isAuthenticated(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.search = async function (req, res) {
  const sername = req.query.sername || "Антонюк";

  try {
    const result = await Result.searchResults(sername);
    const user = req.user;
    const isAdmin = user && user.role === "admin";
    res.render("search", {
      result,
      error: "Результат не найден",
      user,
      isAdmin,
      isLoggedIn: req.isAuthenticated(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
};
