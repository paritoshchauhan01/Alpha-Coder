const express = require("express");
const router = express.Router();
const controller = require("../controllers/newMother.controller");

router.get("/protein", controller.getByProtein);
router.get("/calories", controller.getByCalories);

module.exports = router;
