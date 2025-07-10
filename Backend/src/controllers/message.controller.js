const User = require("../models/auth.model");
const Message = require("../models/message.model");
const cloudinary = require("../services/cloudinary");
const { getOnlineUser,io } = require("../services/socket");
const Follower =require("../models/followers.model")
const mongoose=require("mongoose")

async function getUserData(req, res) {
  try{
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const all=await Message.aggregate([
          {
            $match:{
              $or:[{senderId:userId},
                {recieverId:userId}]
            }
          },
          {
            $project:{
              otherUser:{
                $cond:[
                  {$eq:["$senderId" ,userId]},
                  "$recieverId",
                  "$senderId"
                ]
              },
              updatedAt:1
            }
          },
          {
            $sort:{updatedAt:-1}
          },
          {
            $group:{
              _id: "$otherUser",
               lastMessageAt: { $first: "$updatedAt" }
            }
          },
          {
            $lookup:{
            from:"users",
            localField:"_id",
            foreignField:"_id",
            as:"myUsers"
          }
        },
         { $unwind: "$myUsers" },
         {
          $project:{
              _id:"$myUsers._id",
              bio:"$myUsers.bio",
              name:"$myUsers.name",
              email:"$myUsers.email",
              profileImageUrl:"$myUsers.profileImageUrl",
              lastMessageAt:"$lastMessageAt"
          }
         },
         {
        $sort: { lastMessageAt: -1 }}
        ])
        if (!all) return res.status(400).json({ msg: "Unable to fetch users.." });
        return res.status(200).json(all);
  } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error Occured" });
  }
}


const suggestUser=async(req,res)=>{
  const excludedId=new mongoose.Types.ObjectId(req.user._id)
  try{
    const randomUser=await User.aggregate([
      {
        $match: {
          _id: { $ne: excludedId }
        }
      },
      {
        $sample:{size:2}
      }
    ])
    if(!randomUser) return res.status(400).json({msg:"Unable to fetch users"})
    return res.status(200).json(randomUser)
  }catch(error){
    console.log(error)
  }
}


async function getMessages(req, res) {
  try {
    const otherId = req.params.id;
    const myId = req.user._id;

    if (!otherId || !myId) return res.status(400).json({ msg: "Something went Wrong" });

    const allMessages = await Message.find({
      $or:[
        { senderId: myId, recieverId: otherId },
        { senderId: otherId, recieverId: myId },
      ]
    }).populate('senderId').select("-password");
    if (!allMessages) return res.status(400).json({ msg: "Messages Not found" });

    return res.status(200).json(allMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error Occured" });
  }
}






async function sendMessage(req, res) {
  try {
    const otherId = req.params.id;
    const myId = req.user._id;
    if(!otherId || !myId) return res.status(400).json({msg:"Id Is Needed"})
    const { image,text } = req.body;
    if(!image && !text) return res.status(400).json({msg:"All Fields Are Required"})

    const socketId=getOnlineUser(otherId)

    
    if(image){
      const iupload= await cloudinary.uploader.upload(image);
      const result =await Message.create({
        image:iupload.secure_url,
        recieverId:otherId,
        senderId:myId
      })
      const msgData = await result.populate({
        path:"senderId",
        select:"-password"
      });
      if(!result) return res.status(400).json({msg:"An Error Occured  "})
      io.to(socketId).emit("newMessage",msgData)
      return res.status(200).json(msgData)
    }
    const msg=await Message.create({
      text:text,
      recieverId:otherId,
      senderId:myId
    })
    const msgData = await msg.populate({
      path:"senderId",
      select:"-password"
    });
    if(!msg) return res.status(400).json({msg:"An Error Occured  "})
    
    io.to(socketId).emit("newMessage",msgData)
    return res.status(200).json(msgData)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error Occured" });
  }
}

function getPublicIdFromUrl(url) {
  const parts = url.split('/');
  const fileNameWithExtension = parts[parts.length - 1];
  const fileName = fileNameWithExtension.split('.')[0]; 
  
  const uploadIndex = parts.findIndex(part => part === 'upload');

  const folderParts = parts.slice(uploadIndex + 2, parts.length - 1); 
  folderParts.push(fileName); 

  return folderParts.join('/');
}



async function deleteMessage(req,res){
  try{
    const msgId=req.params.id;
    if(!msgId) return res.status(400).json({msg:"Message Id not found"})
    const ress=await Message.findByIdAndDelete(msgId).populate({
      path:"senderId",
      select:"-password"
  })
    const socketId=getOnlineUser(ress.recieverId)
    if(ress.image){
      const publicId=getPublicIdFromUrl(ress.image)
      if(!publicId) return res.status(400).json({msg:"Public Id Not Found"})
      const imgDeleted=await cloudinary.uploader.destroy(publicId,{invalidate:true})
      if(!imgDeleted) return res.status(400).json({msg:"could Not delete Message !!!"})
    }
    if(!ress) return res.status(400).json({msg:"Not deleted"})
    io.to(socketId).emit("deleteMessage",ress)
    return res.status(200).json({msg:"Deleted Successfully"})
  }catch(error){
    console.log(error)
    return res.status(500).json({msg:"Unable to deletee the message"})
  }
  
}



module.exports = {
  getUserData,
  getMessages,
  deleteMessage,
  sendMessage,
  suggestUser
};
