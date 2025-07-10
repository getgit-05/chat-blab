const Follower = require("../models/followers.model")
const {getOnlineUser,io} =require("../services/socket")
const mongoose=require("mongoose")
const follow=async (req,res)=>{
    
    const myId=req.user._id
    const otherId=req.params.id
    try{
        const socketId = getOnlineUser(otherId)
        const mySocketId=getOnlineUser(myId)
        const follow=await Follower.create({
            followedBy:myId,
            followedTo:otherId
        })
        if(!follow) return res.status(400).json({msg:"Unable To Follow !!"})
        if(socketId) io.to(socketId).emit("followed",follow)
        io.to(mySocketId).emit("accepted",follow)
        return res.status(200).json(follow)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

const getFollowerData=async (req,res)=>{
    try{
        const id=req.params.id;
        if(!id) return res.status(400).json({msg:"Id is required"})
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid user id" });
        }
        const objectId = new mongoose.Types.ObjectId(id);
        const followerData=await Follower.findOne({followedBy:req.user._id,followedTo:objectId})
        if(!followerData) return res.status(400).json(null)
        return res.status(200).json(followerData)

    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error Occured"})
    }

}


const getRequests=async (req,res)=>{
    const myId=req.user._id
    try{
        const requests=await Follower.find({followedTo:myId,accept:false}).populate("followedBy")
        if(!requests) return res.status(404).json({msg:"No Request Found"})
        return res.status(200).json(requests)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error Occured"})
    }
}

const deleteRequests=async (req,res)=>{
    try{
        const {delId}=req.body
        if(!delId) res.status(400).json({msg:"Id is required"})
        const deletedReq=await Follower.findByIdAndDelete(delId)
        if(!deletedReq) res.status(404).json({msg:"Request Not Found"})
        const socketId=getOnlineUser(deletedReq.followedBy)
        io.to(socketId).emit("accepted",deletedReq)
        return res.status(200).json(deletedReq)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error Occured"})
    }
}

const updateRequests=async (req,res)=>{
    try{
        const {updateId}=req.body
        if(!updateId) res.status(400).json({msg:"Id is required"})
        const updateReq=await Follower.findByIdAndUpdate(updateId,{accept:true})
        if(!updateReq) return res.status(404).json({msg:"request not found"})
        const socketId=getOnlineUser(updateReq.followedBy.toString())
    
        io.to(socketId).emit("accepted",updateReq)
        return res.status(200).json(updateReq)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error Occured"})
       
    }

}

const unfollow=async(req,res)=>{
    try{
        const id=req.params.id
        if(!id) res.status(400).json({msg:"Id is required"})
        const unfollow=await Follower.findOneAndDelete({followedBy:req.user._id,followedTo:id})
        const socketId=getOnlineUser(unfollow.followedTo)
        if(socketId) io.to(socketId).emit("followed",{unfollow:true})
        if(!unfollow) return res.status(404).json({msg:"request not found"})
        return res.status(200).json(unfollow)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error Occured"})
    }
}


const followerCount=async (req,res)=>{
    try{
        const id=req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid user id" });
        }
        const objectId = new mongoose.Types.ObjectId(id);
        const followers=await Follower.aggregate([
            {
                $match:{
                    followedTo:objectId,
                    accept:true
                }
            },{
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"followedBy",
                    as:"follower"
                }
            },
            {
                $unwind:"$follower"
            },
            
            {
                $project:{
                    follower:{
                        _id:1,
                        name:1,
                        profileImageUrl:1,

                    },
                    _id:1,
                }
            }
        ])

        const following=await Follower.aggregate([
            {
                $match:{
                    followedBy:objectId,
                    accept:true
                }
            },{
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"followedTo",
                    as:"following"    
                }
            },{
                $unwind:"$following"
            },
            {
                $project:{
                    following:{
                        name:1,
                        _id:1,
                        profileImageUrl:1,
                    },
                    _id:1,
                }
            }

        ])
        return res.status(200).json({follower:followers,following:following})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error"})
    }

}


module.exports={
    follow,
    getFollowerData,
    getRequests,
    deleteRequests,
    updateRequests,
    unfollow,
    followerCount
}