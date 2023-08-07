import nodemailer from 'nodemailer';

export const sendEmail = async({to,subject,text,html,cc,bcc,attachments = [] } = {})=>{
  const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth :{
      user : process.env.EMAIL,
      pass : process.env.EMAIL_PASSWORD
    }
  })
const info = await transporter.sendMail({
  from : `"Magdy" <${process.env.EMAIL}>`,
  to  ,
  subject  ,
  text  ,
  html ,
  cc ,
  bcc ,
  attachments : [
    {
      filename : 'text.txt',
      content :'hello' 
    },
    {
      filename : 'name.txt',
      path :'./t.txt'
    }
  ]
});
console.log(info);
}