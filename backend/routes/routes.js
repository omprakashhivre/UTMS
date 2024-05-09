const {Register,Login, GetUser, GetAllUsers, DeleteUser, UpdateUser,GetAccessToken} = require("../controller/userController")
const {CreateTask , GetAllTasksForUser, UpdateTask, DeleteTask, GetAllTasks, DeleteMultipleTasks} = require("../controller/taskController")
const express = require('express');
const { verifyUser } = require("../controller/verify");
const router = express.Router();


router.post("getAccessToken" , GetAccessToken)


router.post("/register" , Register)
router.post("/login"  , Login)

router.get("/getUser/:id", GetUser)
router.get("/getAllUsers" , GetAllUsers)
router.delete("/deleteUser/:id", DeleteUser)
router.put("/updateUser/:id", UpdateUser)

// task controller methods
router.post("/createTask",verifyUser, CreateTask)
router.get("/getalltasksforuser", verifyUser, GetAllTasksForUser)
router.get("/getalltasksforuser", GetAllTasks)
router.put("/updateTask/:id" ,verifyUser, UpdateTask)
router.delete("/deleteTask/:id" ,verifyUser, DeleteTask)
router.delete("/deleteMultipleTask" ,verifyUser, DeleteMultipleTasks)



module.exports = {router}