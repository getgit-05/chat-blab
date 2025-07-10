const mongoose=require("mongoose")

const messageSchema=mongoose.Schema({
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,      
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,      
    },
    text:{
        type:String,
    },
    image:{
        type:String
    }
},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)

module.exports=Message