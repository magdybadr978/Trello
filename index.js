import  path  from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path : path.join(__dirname,'./config/.env')});

import express from "express";
import bootstrap from "./src/index.router.js";
const app = express();
const port = process.env.PORT || 5000;
//let link =""
app.use("/uploads",express.static("./src/uploads"))
bootstrap(app,express); 
console.log(Date.now());
console.log(new Date());

app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})