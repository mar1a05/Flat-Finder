const express = require("express");
const router = express.Router();
const messageController = require("./MessageController");
const userController = require("./UserController");

router.get("/messages", userController.protectSystem, messageController.getAllMessages);
router.get("/messages/:id", userController.protectSystem, messageController.getAllMessages);
router.post("/addMessage", userController.protectSystem, messageController.addMessage);

module.exports = router;