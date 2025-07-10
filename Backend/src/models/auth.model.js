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
        default:"https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
    },
    bio:{
        type:String,
        default:"No Bio Added"
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema)

module.exports=User
