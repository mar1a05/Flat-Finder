const express = require("express");
const flatController = require("./FlatController");
const userController = require('./UserController');
const router = express.Router();

//router.use(userController.protectSystem);

//CRUD OPERATIONS
// router.post("/addFlat", userController.protectSystem, userController.permission, flatController.createFlat);
router.post("/addFlat", userController.protectSystem, flatController.createFlat);
router.get("/flats", flatController.getAllFlats);
router.get("/flats/:id", userController.protectSystem, flatController.getFlatById);
router.patch("/updateFlat/:id", userController.protectSystem, flatController.updateFlat);
router.delete("/deleteFlat/:id", userController.protectSystem, flatController.deleteFlat);
router.get("/favouriteFlats", userController.protectSystem, flatController.getFavouriteFlats);



//Aggregation
// router.get("/statistics", flatController.getStats);
// router.get("/groupingProductsByYear", flatController.groupingProductsByYear);

module.exports = router;