const express = require("express");
const userController = require("../controllers/userController");
const decodeToken = require("../middleware/decodeToken");

const router = express.Router();

router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.post("/decode-token", decodeToken);
router.get("/users/:id", userController.getUser);

module.exports = router;
