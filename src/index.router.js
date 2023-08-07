import connectDB from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js"
import taskRouter from "./modules/task/task.router.js"
import authRouter from "./modules/Auth/Auth.router.js"
import { globalErrorHandling } from "./utils/errorHandling.js";
const bootstrap = (app,express)=>{
  connectDB();
  app.use(express.json());
  app.use("/Auth",authRouter);
  app.use("/user",userRouter);
  app.use("/task",taskRouter);
  
  app.use(globalErrorHandling);
  
  // app.use("*",(req,res,next)=>{
  //   console.log("In-Valid routing");
  // })

}

export default bootstrap;