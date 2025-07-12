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
        default:"https://chat-blab.onrender.com/public/avatar.svg"
    },
    bio:{
        type:String,
        default:"No Bio Added"
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema)

module.exports=User
