import joi from "joi";
import { globalValidationField } from "../../middleware/Validation.js";

export const signUp = {
  body: joi
    .object({
      userName: joi.string().alphanum().required(),
      email: globalValidationField.email,
      password: globalValidationField.password,
      cPassword: joi.string().valid(joi.ref("password")).required(),
      age: joi.number().integer().positive().min(18).max(100).required(),
      gender: joi.string().required(),
      phone: joi.string().required(),
    })
    .required(),
  params: joi.object({
    flag: joi.boolean().required(),
  }),
}; 


export const signIn = {
  body: joi
    .object({
      email:globalValidationField.email,
      password: globalValidationField.password,
    })
    .required(),
}; 


export const forgetPass = {
  body: joi
    .object({
      email: globalValidationField.email
      
    })
    .required(),
};


export const confirmForget = { body :
 joi.object({
  password: globalValidationField.password,
  cPassword: joi.string().valid(joi.ref("password")).required()
 }).required(),
}

export const unsubscribe = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    token : joi.string().required()
  }),
  query : joi.object().required().keys({}),
}

export const confirmEmail = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    token : joi.string().required()
  }),
  query : joi.object().required().keys({}),
}


export const resendConfirmEmail = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    token : joi.object().required().keys({
      token : joi.string().required()
    })
  }),
  query : joi.object().required().keys({}),
}





















// ingredients : joi.array().items(joi.string().required(),joi.number()).required(),
  // arr : joi.array().items(joi.object({
  //   name : joi.string().empty('').required()
  // }).required()).required(),
  // flag : joi.boolean().sensitive().falsy("0").truthy("1")