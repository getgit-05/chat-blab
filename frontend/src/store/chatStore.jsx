import { createContext, useContext, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../Services/axios";
import toast from "react-hot-toast";
import socket from "../Services/socket"

export const messageContext=createContext(null)


export const MessageProvider=(props)=>{

    const [users,setUsers]=useState(null)
    const [selectUser,setSelectUser]=useState(null)
    const [msgLoad,setIsMsgLoad]=useState(false)
    const [msgData,setMsgData]=useState([])
    const [isSending,setSending]=useState(false)
    const [isDeleting,setDeleting]=useState(false)
    const [msg,setMsg]=useState({})
    const selectUserRef = useRef(selectUser);
    const [suggestUsers,setSuggestUsers]=useState(null)
    const [isSuggesting,setIsSuggesting]=useState(false)

    useEffect(() => {
        selectUserRef.current = selectUser;
      }, [selectUser]);

    
    const getUser=async ()=>{
        
        try{
            const usersdata=await axiosInstance.get("/messages/user")
            if(!usersdata) return toast.error("Something went wrong")
            setUsers(usersdata)
        }catch(error){
            console.log(error)
            return toast.error("An Internal Error Occured")
        }

    }

    const getMessages=async (userId)=>{
        setIsMsgLoad(true)
        try{
            const msg = await axiosInstance.get(`/messages/user/${userId}`)
            if(!msg) return toast.error("Could Not Load Messages")
            setMsgData(msg.data)
        }catch(error){
            console.log(error)
            toast.error("Could Not Load Messages")
        }
        finally{
            setIsMsgLoad(false)
        }
    }

    const deleteMessage=async(id)=>{
        setDeleting(true)
        try{
            const res=await axiosInstance.delete(`/messages/delete/${id}`)
            if(!res) return toast.error("Unable to delete Message")
            return toast.success("Message Deleted successfully")

        }catch(error){
            console.log(error)
            toast.error("Could Not Delete Message")

        }finally{
            setDeleting(false)
        }
    }


    const postMessage=async (msg)=>{
        setSending(true)
        try{
            const res=await axiosInstance.post(`/messages/${selectUser._id}`,msg)
            const newMsg=res.data
            setMsgData([...msgData,newMsg])
        }catch(error){
            console.log(error)
            toast.error("Could Not Load Messages")
        }finally{
            setSending(false)

        }
        
    }

    const suggestUser=async()=>{
        setIsSuggesting(true)
        try{
            const res=await axiosInstance.get("/messages/suggest")
            if(!res) return toast.error("Could Not Load Users")
            setSuggestUsers(res.data)
        }catch(error){
            console.log(error)
            toast.error("Could Not Load Users")
        }finally{
            setIsSuggesting(false)
        }
    }


    const updateMessage=(id)=>{
        socket.on("newMessage",(data)=>{
            if(id!==data.senderId._id) return
            setMsgData(prev=>[...prev ,data])
            getUser()
        })
    }

    const delMessage=(id)=>{
        socket.on("deleteMessage",(data)=>{
        if(id!==data.senderId._id) return
        setMsgData(prev=>prev.filter((msg)=>msg._id!==data._id))
        getUser()    
    })
    }
    
    const stopDelMessage=()=>{
        socket.off("deleteMessage")
    }

    const stopUpdateMessage=()=>{
        socket.off("newMessage")
    }

    return(
        <messageContext.Provider value={{users,getUser,selectUser,setSelectUser,getMessages,msgLoad,msgData,postMessage,msg,isSending,setSending,updateMessage,stopUpdateMessage,isDeleting,deleteMessage,setMsgData,delMessage,stopDelMessage,suggestUsers,suggestUser,isSuggesting}}>
        {props.children}
        </messageContext.Provider>
    )
}

export const useMessages=()=>{
    return useContext(messageContext)
}