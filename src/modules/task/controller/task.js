import taskModel from "../../../../DB/models/task.model.js";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandeler } from "../../../utils/errorHandling.js";

import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

export const addTask =asyncHandeler(
    async(req,res,next)=>{
    const {title,description,assignTo,deadline} = req.body;
    const checkUser = await userModel.findById({_id : assignTo})
    if(!checkUser){
      return next(new Error("cannot be assign to this user beacuse it's not found"))
    }
    if(new Date(deadline) <= new Date()){
      return next(new Error("deadline must be a future date",{cause : 400}))
    }
    const checkModel = await taskModel.findOne({title});
    if(checkModel){
      return next(new Error("Task already exist",{cause : 409}))
    }
    await taskModel.create({title,description,userId : req.user._id,assignTo : req.user._id,deadline : new Date(deadline)});
    return res.status(StatusCodes.CREATED).json({
      message : "add task successfully",
      
    })
  }
) 


export const updateTask =asyncHandeler(
    async(req,res,next)=>{
    const {_id} = req.params;
    const {title,description,status} = req.body;
    const checkTask = await taskModel.findOne({_id})
    if(!checkTask){
     return next(new Error("Task not found"))
    }
  
    const checkTitle = await taskModel.findOne({title : title})
    if(checkTitle){
      return next(new Error("Task already exist",{cause : 409}))
     }
    await taskModel.updateOne({_id,userId:req.user._id},{title,description,status})
     return res.status(StatusCodes.CREATED).json({
       message : "updated task successfully"
  })
  }
) 



export const deleteTask =asyncHandeler(
    async(req,res,next)=>{
    const {_id} = req.params;
    const checkTask = await taskModel.findById({_id})
    if(!checkTask){
      return next(new Error("Task not found",{cause : 404}))
    }
   await taskModel.deleteOne({_id,userId :req.user._id})
   return res.status(200).json({
    message : "deleted task successfully"
   })
  }

) 



export const getAllTasksAndUsers =asyncHandeler(
    async(req,res,next)=>{
    const checkTasksAndUsers = await taskModel.find().populate([
      {
        path : "userId"
      }
    ])
   return res.json({
    message : "get All tasks and users",
    checkTasksAndUsers
   })
  }
) 


export const getTasksOfOneUserAuth =asyncHandeler(
    async(req,res,next)=>{
    const check = await taskModel.find({userId :req.user._id}).populate([
      {
        path : "userId"
      }
    ])
    console.log(check);
    return res.json({
      message : "get Tasks of one user",
      check
    })
  }
)


export const getTasksOfOneUser =asyncHandeler(
  async(req,res,next)=>{
  const {userId} = req.query;
  const check = await taskModel.find({userId}).populate([
    {
      path : "userId"
    }
  ])
  console.log(check);
  return res.json({
    message : "get Tasks of one user",
    check
  })
}
)

export const getAllTasksWithDeadLine = asyncHandeler(
  async(req,res,next)=>{
    const checkDeadLine = await taskModel.find({
      deadline : {$lt :new Date()},
      $or : [{status : "toDo"},{status: "doing"}]
    })
    return res.json({
      message : "get all tasks after deadline",
      checkDeadLine
    })
  }
)
