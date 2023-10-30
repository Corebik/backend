const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const check = require("../middlewares/auth");

// Definir rutas 
router.get("/prueba", check.auth, userController.prueba);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;