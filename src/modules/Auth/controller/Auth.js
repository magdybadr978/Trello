import bcrypt from "bcrypt";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandeler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/email.js";
import { nanoid } from "nanoid";
//import * as validators from "../validation.js"

export const signUp = asyncHandeler(async (req, res, next) => {
  const { userName, email, password, cPassword, age, gender, phone } = req.body;
  // if(password != cPassword){
  //   return next(new Error("password not match cPassword"))
  // }
  const checkUser = await userModel.findOne({
    $or: [{ email }, { userName }, { phone }],
  });
  if (checkUser) {
    //throw new Error("Email exist")
    return next(
      new Error("user already exist", { cause: StatusCodes.CONFLICT })
    );
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    cPassword: hashPassword,
    age,
    gender,
    phone,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SEG,
    { expiresIn: 60 * 60 }
  );
  const resendToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_KEY
  );
  const link = `${req.protocol}://${req.headers.host}/Auth/confirmEmail/${token}`;
  const rflink = `${req.protocol}://${req.headers.host}/Auth/confirmEmail/resend/${resendToken}`;
  const unsubscribe = `${req.protocol}://${req.headers.host}/Auth/unsubscribe/${resendToken}`
  await sendEmail({
    to: email,
    subject: "confimEmail",
    html: `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
      <style type="text/css">
      body{background-color: #88BDBF;margin: 0px;}
      </style>
      <body style="margin:0px;"> 
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
      <tr>
      <td>
      <table border="0" width="100%">
      <tr>
      <td>
      <h1>
          <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
      </h1>
      </td>
      <td>
      <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
      <tr>
      <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
      <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
      </td>
      </tr>
      <tr>
      <td>
      <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
      </td>
      </tr>
      <tr>
      <td>
      <p style="padding:0px 100px;">
      </p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${rflink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Re_send</a>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${unsubscribe}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">unsubscribe</a>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
      <tr>
      <td>
      <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
      </td>
      </tr>
      <tr>
      <td>
      <div style="margin-top:20px;">

      <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
      
      <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
      </a>
      
      <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
      </a>

      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>`,
  });
  return res.status(200).json({
    message: "add user successfully",
    user,
  });
});

export const signIn = asyncHandeler(async (req, res, next) => {
  const { email, userName, password, phone } = req.body;
  const checkUser = await userModel.findOne({
    $or: [{ email }, { phone }, { userName }],
  });

  console.log(checkUser);
  if (!checkUser) {
    return next(new Error("user not found"));
  }
  if (!checkUser.confirmEmail) {
    return next(new Error("not confirm email"));
  }
  const match = bcrypt.compareSync(password, checkUser.password);
  if (!match) {
    return next(new Error("In-Valid password"));
  }
  await userModel.updateOne(
    { _id: checkUser._id },
    { isLogin: true, isDeleted: false }
  );
  const token = jwt.sign(
    { name: checkUser.userName, id: checkUser._id, isLogin: true },
    process.env.SECRET_KEY,
    { expiresIn: 60 * 60 }
  );
  return res.status(200).json({
    message: "Welcome back",
    token,
  });
});

export const confirmEmail = asyncHandeler(async (req, res, next) => {
  const { token } = req.params;
  console.log({ token });
  const decoded = jwt.verify(token, process.env.EMAIL_SEG);
  console.log(decoded);
  const user = await userModel.updateOne(
    { _id: decoded.id },
    { confirmEmail: true }
  );
  return res.json({
    message: "done",
    user,
  });
});

export const resendConfirmEmail = asyncHandeler(async (req, res, next) => {
  const { token } = req.params;
  console.log({ token });
  const decoded = jwt.verify(token, process.env.EMAIL_SEG);
  console.log(decoded);
  const user = await userModel.findById({ _id: decoded.id });
  if (!user) {
    return res.json({
      message: "user not found",
    });
  }
  if (user.confirmEmail) {
    return res.json({
      message: "log in",
    });
  }
  const newToken = jwt.sign(
    { id: decoded.id, email: decoded.email },
    process.env.EMAIL_SEG,
    { expiresIn: 60 * 3 }
  );
  await sendEmail({
    to: email,
    subject: "confimEmail",
    html: "<p>Hello</p>",
  });
  return res.send("done");
});

export const forgetPass = asyncHandeler(async (req, res, next) => {
  const { email } = req.body;
  const checkEmail = await userModel.findOne({ email });
  if (!checkEmail) {
    return next(new Error("user not exist"));
  }

  const token = jwt.sign({ email: email }, process.env.EMAIL_SEG, {
    expiresIn: 60 * 60,
  });
  const link = `${req.protocol}://${req.headers.host}/confirmForget/${token}`;

  await sendEmail({
    to: email,
    subject: "confimEmail",
    html: `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
      <style type="text/css">
      body{background-color: #88BDBF;margin: 0px;}
      </style>
      <body style="margin:0px;"> 
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
      <tr>
      <td>
      <table border="0" width="100%">
      <tr>
      <td>
      <h1>
          <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
      </h1>
      </td>
      <td>
      <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
      <tr>
      <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
      <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
      </td>
      </tr>
      <tr>
      <td>
      <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
      </td>
      </tr>
      <tr>
      <td>
      <p style="padding:0px 100px;">
      </p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Yes,it's me</a>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
      <tr>
      <td>
      <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
      </td>
      </tr>
      <tr>
      <td>
      <div style="margin-top:20px;">

      <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
      
      <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
      </a>
      
      <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
      </a>

      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>`,
  });

  return res.json({
    message: "confirm forget",
  });
});

export const confirmForget = asyncHandeler(async (req, res, next) => {

  const {password,cPassword} = req.body;
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUND)
    );
   const createPass = await userModel.updateOne(
    { email: decoded.email },
    { password: hashPassword, cPassword: hashPassword }
  );
  return res.json({
    message: "created password",
    createPass
  })
});

export const unsubscribe = asyncHandeler(
  async(req,res,next)=>{
    const {token} = req.params;
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const user = await userModel.findById({_id : decoded.id})
    if(!user){
      return next(new Error("user not found"))
    }
     await userModel.deleteOne(
      {_id : decoded.id}
    )
    return res.json({
      message : "unsubscribe"
    })
  }
)



