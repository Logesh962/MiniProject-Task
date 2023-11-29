const { Router } = require("express");

const isAuth = require("../middleware/is-admin");
const adminServices = require("../services/admin");

const router = Router({ strict: true });

router.post("/login", adminServices.login);
router.post("/register", adminServices.register);
router.get("/auth-admin", isAuth, adminServices.getAuthAdmin);
router.post("/saveTask", adminServices.saveNewTask);
router.put("/updateTask/:id", adminServices.updateNewTask);
router.delete("/deleteTask/:id", adminServices.deleteTask);
router.get("/getTasks", adminServices.getTask);


module.exports = router;
