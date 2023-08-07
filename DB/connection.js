import mongoose from "mongoose";

const connectDB = async()=>{
  return await mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Connected database successfully");
  }).catch((err)=>{
    console.log("fail to connect");
  })
}

export default connectDB;