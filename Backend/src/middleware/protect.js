const { getUser } = require("../services/auth.service")

async function protect(req,res,next){
    const token=req.cookies.token
    if(!token) return res.status(400).json({msg:"Invalid Token"})
    
    const user=getUser(token)
    if(!user) return res.status(400).json({msg:"Invalid Token"})
    
    req.user=user;
    next()
}

module.exports={
    protect
}