import {createContext, useContext, useMemo} from 'react'
import { axiosInstance } from '../Services/axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import socket from "../Services/socket"
import {  useNavigate} from 'react-router-dom'



export const protectContext=createContext(null)


export const connetSocket=()=>{
    if(!socket.connected) socket.connect();
}


const disconnectSocket=()=>{
    if(socket.connected) socket.disconnect()
}

export const ProtectProvider= (prop)=>{
    const[data,setData]=useState(null)
    const[usser,setUser]=useState(null)
    const[isChecking,setIsChecking]=useState(true)
    const[isFinding,setIsFinding]=useState(true)
    const[isSignin,setIsSignin]=useState(false)
    const[isLogin,setIsLogin]=useState(false)
    const[isUploading,setIsUploading]=useState(false)
    const [onlineUsers,setOnlineUsers]=useState([])

    const navigate=useNavigate()
    const checkAuth=async ()=>{
        setIsChecking(true)
        try{
            const data=await axiosInstance.get("/auth/check")
            if(!data) setData(null)
            setData(data)
            connetSocket()
        }catch(error){
            console.log("Error :-",error)
            setData(null)
        }finally{
            setIsChecking(false)
        }
    }

  

    const signin=async (dataa)=>{
        setIsSignin(true)
        try{
            const data=await axiosInstance.post("/auth/signin",dataa)
            if(!data) return toast.error("Some thing is Wrong")
            toast.success("Sign Up Successfully")
            connetSocket()
            navigate("/")
        }catch(error){
            console.log(error)
            return toast.error("An Error Occured")

        }finally{
            setIsSignin(false)
        }
    }

    const logout=async ()=>{
        try{
            await axiosInstance.post('/auth/logout')
            setData(null)
            disconnectSocket()
            toast.success("Logged Out Successfully")
        }catch(error){
            console.log("An Error Occured",error)
            toast.error("Unknown Error !!")
            
        }
    }

    const login=async (dataa)=>{
        setIsLogin(true)
         try{
            const data=await axiosInstance.post("/auth/login",dataa)
            toast.success("Logged In Successfully")
            connetSocket()
            navigate("/")
        }catch(error){
            console.log(error)
            return toast.error("Wrong Email Or Password")

        }finally{
            setIsLogin(false)
        }

    }


    const upload=async (file)=>{
        setIsUploading(true)
        try{
            const photo=await axiosInstance.put("/auth/update-photo",file)
            if(!photo) return toast.error("Upload Could Not be Processed")
            return toast.success("Image Uploaded")
        }catch(error){
            console.log(error)
            return toast.error("Image Upload Failed")
        }
        finally{
            setIsUploading(false)
        }
    }

    const loadUser=async (id)=>{
        setIsFinding(true)
        try{
            const foundUser= await axiosInstance.get(`/auth/${id}`)
            if(!foundUser) return toast.error("User Not Found")
            setUser(foundUser)
        }catch(error){
            console.log(error)
            toast.error("User Not Found !")

        }finally{
            setIsFinding(false)
        }
    }

    const updateBio=async (data)=>{
        try{
            const bio=await axiosInstance.post("/auth/bio",{about:data})
            if(!bio) return toast.error("Error in Updating Bio")
            return toast.success("Updated Successfully")
        }catch(error){
            console.log(error)
            return toast.error("Error in Updating Bio")
        }
    }

    const searchUser=async (text)=>{
        try{
            const user=await axiosInstance.get("/auth/user/data",{params:{text:text}})
            if(!user) return []
            return user.data
        }catch(error){
            console.log(error)
            return toast.error("Unable to search user")
        }
    }


    socket.on("getOnlineUsers",(data)=>{
        if(socket.connected) setOnlineUsers(data)
    },[socket.connected])

    
    const value = {
        checkAuth,
        data,
        setData,
        isChecking,
        signin,
        isSignin,
        logout,
        isLogin,
        login,
        upload,
        isUploading,
        onlineUsers,
        setOnlineUsers,
        setUser,
        usser,
        loadUser,
        updateBio,
        searchUser
    }

    return(
        <protectContext.Provider value={value}>
            {prop.children}
        </protectContext.Provider>
    )
}