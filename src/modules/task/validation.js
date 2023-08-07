import joi from "joi";
import { globalValidationField } from "../../middleware/Validation.js";

export const addTask = {
  body: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      assignTo: joi
        .string()
        .pattern(new RegExp(/^[a-f0-9]{24}$/))
        .required(),
      deadline: joi.date().required(),
    })
    .required(),
};

export const updateTask = {
  body: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      status: joi.string().required(),
    })
    .required(),
  params: joi.object({
    _id: joi
      .string()
      .pattern(new RegExp(/[a-f0-9]{24}/))
      .required(),
  }),
};

export const deleteTask = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    _id : globalValidationField._id
  }),
  query : joi.object().required().keys({}),
}
