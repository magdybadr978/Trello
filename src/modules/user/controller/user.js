import bcrypt from "bcrypt";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandeler } from "../../../utils/errorHandling.js";
//import { sendEmail } from "../../../utils/email.js";
import jwt from "jsonwebtoken"
import cloudinary from "../../../utils/cloudinary.js";
export const changePass =asyncHandeler(
  async(req,res,next)=>{
  const {password,newPassword} = req.body;
  const decodedPass = bcrypt.compareSync(password,req.user.password)
  console.log(req.user.password);
  // const checkPass = await userModel.findOne({password:password})
   if(!decodedPass){
     return next(new Error("In-Valid password"))
   }
  const hashPassword = bcrypt.hashSync(newPassword,parseInt(process.env.SALT_ROUND));
  await userModel.updateOne({_id : req.user._id},{password : hashPassword});
   console.log(password);
   console.log(hashPassword);
  return res.json({
    message : "Updated password successfully"
  })
}
) 

export const deleteUser =asyncHandeler(
    async(req,res,next)=>{
  await userModel.deleteOne({_id : req.user._id})
  return  res.json({
    message : "user deleted successfully"
  })
  }
) 

export const softDeleteUser = asyncHandeler(
  async(req,res,next)=>{
    const {user} = req;
    await userModel.updateOne({_id : user._id},{isDeleted : true})
    return res.json({
      message : "soft deleted user successfully"
    })
  }
)

export const updateUser =asyncHandeler(
    async(req,res,next)=>{
    const {age,newUserName} = req.body;
    const checkUser = await userModel.findOne({userName : newUserName})  //{}   null
    if(checkUser){
      return next(new Error("user already exist",{cause : 409}))
    }
    await userModel.updateOne({_id : req.user._id},{age,userName : newUserName});
    return res.json({
      message : "updated user successfully"
    })
  
  }
) 

export const logOut =asyncHandeler(
  async(req,res,next)=>{
    await userModel.updateOne({_id : req.user._id},{isLogin : false})
    return res.status(200).json({
      message : "Loged out"
    })
  }) 

export const getAll =asyncHandeler(
    async(req,res,next)=>{
    const users = await userModel.find();
    return res.json({
      message : "get all users successfully",
      users
    })
  }
) 


export const profileImage = asyncHandeler(
  async(req,res,next)=>{
    console.log(req.file.finalDest);
    const user = await userModel.findByIdAndUpdate(
       req.user._id,
      {profileImage : req.file.finalDest},
      {new : true})
    return res.json({
      message : "done",
      user,
      file : req.file
    })
  }
)

export const profileCoverImage = asyncHandeler(
  async(req,res,next)=>{
    const coverImages = [];
    for (const file of req.files) {
      coverImages.push(file.finalDest)
    }
    const user = await userModel.findByIdAndUpdate(req.user._id,{coverImage},{new : true})
    return res.json({
      message : "done",
      file : req.files,
      user
    })
  }
)


export const profileImageCloud = asyncHandeler(
  async(req,res,next)=>{
    console.log(req.file.path)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder :`c40/user/${req.user._id}/profile/cloud`})
    const user = await userModel.findByIdAndUpdate(req.user._id,{profileImageCloud :{secure_url,public_id}},{new : true}) 
    return res.json({
      message : "Done",
      user,
      file :req.file
    })
  }
)

export const profileCoverImageCloud = asyncHandeler(
  async(req,res,next)=>{
    const coverImages = [];
    for (const file of req.files) {
      const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder :`c40/user/${req.user._id}`}/profile/cover/cloud)
      coverImages.push({secure_url,public_id})
    }
    const user = await userModel.findByIdAndUpdate(req.user._id,{coverImagesCloud},{new : true})
    return res.json({
      message : "done",
      file : req.files,
      user
    })
  }
)