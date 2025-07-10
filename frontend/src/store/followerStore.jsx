import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../Services/axios";
import toast from "react-hot-toast";
import socket from "../Services/socket";
const followerContex=createContext(null)

export const FollowerProvider=(props)=>{
    const [followed,setFollowed]=useState([])
    const [followerData,setFollowerData]=useState(null)
    const [requests,setRequests]=useState(null)
    const [isfollowing,setIsFollowing]=useState(false)
    const [isRequesting,setIsRequesting]=useState(false)
    const [isDelReq,setIsDelReq]=useState(false)
    const [isAccepting,setIsAccepting]=useState(false)
    const [isUnfollowing,setIsUnfollowing]=useState(false)
    const [notiCount,setNotiCount]=useState(false)
    const [followCount,setFollowerCount]=useState(null)
    const [followingCount,setFollowingCount]=useState(null)
    const [isSettingCount,setSettingCount]=useState(false)

    useEffect(()=>{
        if(!socket.connected) return
        socket.on("followed",(red)=>{
            setFollowed(prev=>[...prev,red])
            setIsRequesting(false)
            setIsUnfollowing(false)
            getRequests()
        })

        return ()=> {
            socket.off("followed")
        }

    },[socket.connected])  


    const follow=async (id)=>{
        setIsFollowing(true)
        try{
            const follow=await axiosInstance.post(`/follower/follow/${id}`,{socketId:socket.id})
            if(!follow) return toast.error("Unable to Send Request")
            setFollowed([...followed,follow.data])
        }catch(error){
            console.log(error)
            return toast.error("Unable to Send Request")
        }
        finally{
            setIsFollowing(false)
        }
        
    }

    const unFollow=async (id)=>{
        setIsUnfollowing(true)
        try{
            const unfollow=await axiosInstance.post(`/follower/unfollow/${id}`)
            if(!unfollow) return toast.error("User Not Found !!")
            return toast.success("Unfollowed")
        }catch(error){
            console.log(error)
            return toast.error("Unable to Unfollow !!")
        }finally{
            setIsUnfollowing(false)
        }
    }

    const fetchFollower=async (id)=>{
        try{
            const followerData=await axiosInstance.get(`/follower/follow/${id}`)
            if(!followerData || !followerData.data) {
                setFollowerData(null);
                return toast.error("Unable to fetch Data");
            }
            setFollowerData(followerData)
        }catch(error){
            setFollowerData(null)
            console.log(error)

        }
    }

    const getRequests=async()=>{
        setIsRequesting(true)
        try{
            const request=await axiosInstance.get("/follower/requests")
            if(!request){
                setRequests(null)
                return toast.error("Unable to fetch Data")
            } 
            setRequests(request)
        }catch(error){
            console.log(error)
            setRequests(null)
        }finally{
            setIsRequesting(false)

        }
    }

    const deleteReq=async (id)=>{
        setIsDelReq(true)
        try{
            const delReq=await axiosInstance.delete("/follower/requests",{data:{delId:id}})
            if(!delReq) toast.error("Can Not delete Request")
        }catch(error){
            console.log(error)
        }finally{
            setIsDelReq(false)
        }
    }


    const acceptReq=async (id)=>{
        setIsAccepting(true)
        try{
            const updateReq=await axiosInstance.put("/follower/requests",{updateId:id})
            if(!updateReq) toast.error("Can Not accept Request")
        }catch(error){
            console.log(error)
        }finally{
            setIsAccepting(false)
        }
    }

    const followerCount=async (id)=>{
        setSettingCount(true)
        try{
            const followCnt=await axiosInstance.get(`/follower/count/${id}`)
            if(!followCnt) return toast.error("User Not Found")

            setFollowerCount(followCnt.data.follower)
            setFollowingCount(followCnt.data.following)
        }catch(error){
            console.log(error)
            setFollowerCount(null)
            setFollowingCount(null)
            toast.error("Unabe to fetch followers Count")
        }finally{
            setSettingCount(false)
        }
    }


    const value={
        follow,
        isfollowing,
        setIsFollowing,
        followed,
        setFollowed,
        followerData,
        setFollowerData,
        fetchFollower,
        getRequests,
        requests,
        setRequests,
        isRequesting,
        setIsRequesting,
        deleteReq,
        isDelReq,
        setIsDelReq,
        acceptReq,
        isAccepting,
        setIsAccepting,
        setIsUnfollowing,
        isUnfollowing,
        unFollow,
        notiCount,
        setNotiCount,
        followerCount,
        followCount,
        setFollowerCount,
        setSettingCount,
        isSettingCount,
        setFollowingCount,
        followingCount
    }
    return(
        <followerContex.Provider value={value}>
            {props.children}
        </followerContex.Provider>
    )
}

export const useFollower=()=>{
    return useContext(followerContex)
}