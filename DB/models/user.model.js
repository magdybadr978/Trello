import { Schema,model } from "mongoose";

const userSchema = new Schema({
  userName : {
    type : String,
    required : true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  cPassword : {
    type : String,
    
  },
  age : {
    type : Number,
    required : true
  },
  gender : {
    type : String,
    default : "Male",
    enum : ["Male","Female"]
  },
  phone : {
    type : String,
    required : true,
    unique : true
  },
  isLogin : {
    type : Boolean,
    default : false
  },
  confirmEmail : {
    type : Boolean,
    default : false
  },
  isDeleted : {
    type : Boolean,
    default : false
  },
  profileImage : String, 
   
  coverImage : [String],

  
  profileImageCloud : {secure_url : String,public_id : String},
  
  coverImagesCloud : [{secure_url :String,public_id :String}]
  
},
{
  timestamps : true
})

const userModel = model('User',userSchema);
export default userModel;