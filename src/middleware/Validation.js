import joi from "joi";
import {Types} from "mongoose";
export const globalValidationField = {
  email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 5,
          tlds: { allow: ["com", "org", "edu", "eg"] },
        })
        .required(),
  password : joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
  _id : joi.custom((value,helper)=>{
          if(Types.ObjectId.isValid(value)){
            return true
          }else{
            return helper.message ("invalid id")
          }
  }).required(),
  file : joi.object({
    size : joi.number().positive().required(),
    path : joi.string().required(),
    filename : joi.string().required(),
    destination :joi.string().required()
  })
}

const dataMethods = ["body", "params", "query", "headers", "file"];
export const validation = (schema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error);
        }
      }
    });
    if (validationErr.length) {
      return next(new Error(validationErr,{ cause: 400 }));
      // return res.json({
      //   validationErr
      // })
    }
    return next();
  };
};

// export const validation = (schema)=>{
//   return (req,res,next)=>{
//     const data = {...req.body,...req.params,...req.query}
//   const validationResult =schema.validate(data,{abortEarly : false})
//   if(validationResult.error){
//     return next(new Error(validationResult.error))
//   }
//     return next();
//   }
// }
