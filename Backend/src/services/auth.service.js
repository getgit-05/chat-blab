const jwt =require("jsonwebtoken")

const secret=process.env.JWT_SECRET


function setUser(user){
    const payload={
        _id:user._id,
        name:user.name,
        email:user.email,
        profileImageUrl:user.profileImageUrl
    }

    const token=jwt.sign(payload,secret)
    return token
}

function getUser(token){
    const payload=jwt.verify(token,secret)
    return payload
}


module.exports={
    getUser,
    setUser
}