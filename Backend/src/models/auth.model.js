const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:"https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"
    },
    bio:{
        type:String,
        default:"No Bio Added"
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema)

module.exports=User
