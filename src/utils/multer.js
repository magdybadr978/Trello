
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path, { dirname } from "path";

import { fileURLToPath } from "url";
const __dirname = fileURLToPath(import.meta.url);

export const fileValidation = {
  image : ["image/jpeg","image/png","image/gif"],
  file : ["application/pdf","application/msword"]
}
export function fileUpload(customPath = "general",customValidation = []){
  const filePath =`uploads/${customPath}`;
  const fullPath = path.join(__dirname,`../../${filePath}`)
  //path is a built in module 
  //console.log({customPath,isExist : fs.existsSync(filePath)});
  //console.log({dirname : __dirname});
  if(!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath,{recursive : true})
  }

  //recursive if parent not exist .. please create parent first

 const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null,fullPath)
  },
  filename : (req,file,cb)=>{
    const uniqueFileName = nanoid()+"__"+file.originalname
    file.finalDest = `${filePath}/${uniqueFileName}`;
    //console.log(file.finalDest);
  //  console.log(uniqueFileName);
    cb(null,uniqueFileName)
  }
 })
 function fileFilter(req,file,cb){
  if(customValidation.includes(file.mimetype)){
    cb(null,true)
  }else{
    cb(new Error("In-valid file format",{cause : 400}),false)
  }
 }
 const upload = multer({fileFilter,storage})
 return upload
}