const express = require("express");
const router = express.Router();
const controller = require("../controllers/general.controller");

router.get("/cuisine", controller.getByCuisine);
router.get("/flavor", controller.getByFlavor);

module.exports = router;
