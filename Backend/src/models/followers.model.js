const mongoose=require("mongoose")

const followerSchema=mongoose.Schema({
    followedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    followedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    accept:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Follower=mongoose.model("Follower",followerSchema)

module.exports=Follower