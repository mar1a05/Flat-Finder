const express = require("express");
const router = express.Router();
const userController = require("./UserController");


router.get("/users/:id", userController.getUserById);
router.post("/users/register", userController.signup);
router.post("/users/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);
router.patch("/updatePassword", userController.protectSystem, userController.updatePassword);
router.patch("/users/update", userController.protectSystem, userController.updateProfile);
router.delete("/users/delete", userController.protectSystem, userController.deleteProfile);

router.get("/me", userController.protectSystem, userController.getCurrentUser);

//Only for admin
router.get("/users", userController.protectSystem, userController.permission, userController.getAllUsers);
router.patch("/users/updateUser", userController.protectSystem, userController.permission, userController.updateOtherUserProfile);
router.patch("/users/deleteUser", userController.protectSystem, userController.permission, userController.deleteOtherUser);

module.exports = router;