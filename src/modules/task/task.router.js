import {Router} from "express";
import { addTask, deleteTask, getAllTasksAndUsers, getAllTasksWithDeadLine, getTasksOfOneUser, getTasksOfOneUserAuth, updateTask } from "./controller/task.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import * as validators from "./validation.js"; 
const router = Router();

router.post("/addTask",validation(validators.addTask),auth,addTask);
router.put("/updateTask/:_id",validation(validators.updateTask),auth,updateTask);
router.delete("/deleteTask/:_id",validation(validators.deleteTask),auth,deleteTask);
router.get("/getAllTasksAndUsers",getAllTasksAndUsers);
router.get("/getTasksOfOneUserAuth",auth,getTasksOfOneUserAuth);
router.get("/getTasksOfOneUser",getTasksOfOneUser);
router.get("/getAllTasksWithDeadLine",getAllTasksWithDeadLine);
export default router;