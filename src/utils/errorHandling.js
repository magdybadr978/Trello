


export const asyncHandeler = (fn)=>{
  return (req,res,next)=>{
    fn(req,res,next).catch((error)=>{
      return next(new Error(error,{cause :500}))
    })
  }
}

export const globalErrorHandling = 
(error,req,res,next)=>{
  return res.status(error.cause || 500).json({
    message : error.message,
    error,
    stack : error.stack
  })
}