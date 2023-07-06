const express = require("express");
const controller = require("../controllers/results");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/unit/:id", controller.getResultsByUnit);

router.get("/create", isAdmin, controller.getCreate);
router.post("/create", controller.createResult);

router.post("/delete/:id", isAdmin, controller.deleteResult);

router.get("/update/:id", isAdmin, controller.getUpdate);
router.post("/update/:id", controller.updateResult);

router.get("/sort", controller.sort);

router.get("/search", controller.search);

module.exports = router;
