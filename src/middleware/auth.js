import jwt from "jsonwebtoken";
import { asyncHandeler } from "../utils/errorHandling.js";
import userModel from "../../DB/models/user.model.js";

export const auth =asyncHandeler(
  async(req,res,next)=>{
  //  console.log(req);
    const {authorization} = req.headers;
    //console.log(authorization);
    if(!authorization?.startsWith(process.env.BEARER_KEY)){
      return res.status(400).json({
        message : "authorization is required or In-Valid bearer"
      })
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if(!token){
      return next(new Error("In-Valid token",{cause : 401}))
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    //console.log(decoded);
    if(!decoded?.id){
      return res.json({
        message : "In-Valid token payload"
      })
    }
  
    const user = await userModel.findById(decoded.id)
    if(!user){
      return res.json({
        message : "not register user"
      })
    }
    req.user = user;
    //console.log(req);
      
    req.decoded = decoded;
    if(!user.confirmEmail){
      return next(new Error("not confirm email"))
    }
    if(user.isDeleted){               // soft delete user
      return next(new Error("log in first"))
    }
    if(!user.isLogin){
      return next(new Error("log in first"))
    }
    //console.log(req.user.password);
    return next()
  }
) 