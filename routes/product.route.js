const Router = require('express').Router;
const router = Router();
const controller = require("../controllers");

router.get("/", controller.search);

module.exports = router;