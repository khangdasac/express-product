const Router = require('express').Router;
const router = Router();
const controller = require("../controllers");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

module.exports = router;