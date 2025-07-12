const {setUser}=require("../services/auth.service")
const bcrypt=require("bcrypt");
const User = require("../models/auth.model");
const cloudinary = require("../services/cloudinary");

const signin= async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({msg:"All fields Are Required"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(password,salt)

        const user=await User.create({
            name,
            email,
            password:hashedPass,
        })

        if(!user){
            return res.status(400).json({msg:"An Error Occured"})
        }
    
        const token=setUser(user)

        if(!token){
            res.status(400).json({msg:"An Error Occured"})
            return
        }
        res.cookie("token",token,{
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        }).status(200).json(
            {
                _id:user._id,
                name:user.name,
                email:user.email,
                profileImageUrl:user.profileImageUrl
        });

    }catch(err){
        res.status(500).json({msg:"An Internal Error Occured"})
        console.log(err)
    }

}


const login=async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
       return res.status(400).json({msg:"Incorrect Credentials"}) 
    }

    try {
        const result=await bcrypt.compare(password,user.password)
        if(!result){
            return res.status(400).json({msg:"Incorrect Creedentials"})
        }

    

        const token=setUser(user)

        if(!token){
            return res.status(400).json({msg:"An Error Occured"})
        }

        return res.status(200).cookie("token",token,{
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        }).json(
            {
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl
        })

    } catch (error) {
        res.status(500).json({msg:"Internal Server Error Occured"})
        console.log(error)
    }
}

const logout=(req,res)=>{
    try{   
        return res.status(200).clearCookie("token").json({msg:"Logged Out Successgfully"})
    }
    catch(err){
        return res.status(500).json({msg:"An Internal Error Occured"})
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



const upload=async (req,res)=>{
    try{
        const {file}=req.body
        if(!file) return res.status(400).json({msg:"File is Required !!!"})
        const result=await cloudinary.uploader.upload(file);
        const userID=req.user._id;
        const publicId=getPublicIdFromUrl(req.user.profileImageUrl)
        if(!publicId) return res.status(400).json({msg:"Public Id Not Found"})
        const user=await User.findByIdAndUpdate(userID,{profileImageUrl:result.secure_url},{new:true})
        const imgDeleted=await cloudinary.uploader.destroy(publicId,{invalidate:true})
        if(!user) return res.status(400).json({msg:"Invalid User"})
        return res.status(200).json({profileImageUrl:result.secure_url});
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:"Internal Server Error Occured"})
    }
}



const check= async (req,res)=>{
    try{
        const userId=req.user._id;
        if(!userId) return res.status(400).json({msg:"Not Authorized"})
        const data=await User.findOne({_id:userId}).select("-password")
        if(!data) return res.status(400).json({msg:"Not Authorized"})
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internall Server Error Occured"})
    }
}

const getUser=async(req,res)=>{
    try{
        const userId=req.params.id
        if(!userId) return res.status(400).json({msg:"User Id is required"})
        const foundUser=await User.findById(userId).select("-password")
        if(!foundUser) return res.status(404).json({msg:"User Not Found !!"})
        return res.status(200).json(foundUser)

    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"an Internal Error Occured"})
    }
}

const searchUser=async (req,res)=>{
    const text=req.query.text
    if(!text) return res.status(400).json({msg:"Tesx is required !!"})
    try{
        const usser=await User.find({name:{$regex:text,$options:"i"}}).select("-password")
        if(!usser) return res.status(404).json({msg:"User Not Found !!"})
        return res.status(200).json(usser)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"An Internal Error Occured"})
    }
}


const updateBio=async (req,res)=>{
    try{
        const id=req.user._id
        const {about}=req.body
        if(!id) return res.status(400).json({msg:"Id Is required"})
        if(!about) return res.status(400).json({msg:"Bio Is required"})
        const bio=await User.findByIdAndUpdate(id,{bio:about})
        if(!bio) return res.status(404).json({msg:"User Not Found !"})
        return res.status(200).json(bio)
   }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Internal Server Error"})
   }
}


module.exports={
    signin,
    login,
    logout,
    upload,
    check,
    getUser,
    updateBio,
    searchUser
}