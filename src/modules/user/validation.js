import joi from "joi";
import { globalValidationField } from "../../middleware/Validation.js";

export const changePass = {
  body: joi
    .object({
      password: globalValidationField.password,
      newPassword: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    })
    .required(),
};

export const updateUser = {
  body: joi
    .object({
      age: joi.number().positive().integer().required(),
      newUserName: joi.string().alphanum().required(),
    })
    .required(),
};


