import React, { useContext, useEffect, useState } from 'react'
import { protectContext } from "../store/authStoree";
import { Users, UserPlus } from 'lucide-react';
import { useFollower } from '../store/followerStore';
import { useMessages } from '../store/chatStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import socket from '../Services/socket';
import Input from './Input'

function User(prop) { 
    
  

  const protect = useContext(protectContext);
  const msg=useMessages()
  const follow=useFollower()
  const navigate=useNavigate()
  const {id}=useParams()
  const [showMessageInput, setShowMessageInput] = useState(false);

  useEffect(()=>{
    protect.loadUser(id)
    msg?.setSelectUser(user)
    // follow.followerCount(id)
  },[])


  useEffect(()=>{
    protect.loadUser(id)
    follow.followerCount(id)
  },[follow.isFollowing,follow.isUnfollowing,follow.isSettingFollower])


  useEffect(()=>{
    if(!socket.connected) return
    socket.on("accepted",(data)=>{
      follow.fetchFollower(id)
      follow.followerCount(id)
    })

    return ()=>{
      socket.off("accepted")
    }
  },[socket.connected])




  const user = protect?.usser?.data || {};
  const handleFollow=(e)=>{
    e.preventDefault()
    follow.follow(protect?.usser?.data?._id)
  }


  useEffect(()=>{
    follow.fetchFollower(id)
},[])

  useEffect(()=>{
    follow.fetchFollower(id)
},[protect.loadUser,protect.usser,follow.isUnfollowing,follow.isFollowing, follow.isDelReq])

  const unfollow=(e)=>{
    e.preventDefault()
    follow.unFollow(id)
  }

  const handleMsg=()=>{
    if (user && user._id) {
    setShowMessageInput((prev)=>!prev)
    msg.setSelectUser(user)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-2xl mx-auto bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col md:flex-row gap-8 animate-fade-in">
        <div className="flex w-full flex-col items-center bg-gray-800/80 rounded-2xl shadow-xl p-8 md:w-1/3">
          <div className="relative mb-4 w-full flex flex-col items-center">
            {showMessageInput ? (
              <div className=" w-full flex flex-col items-center justify-center gap-4">
                <div className="text-lg font-semibold text-blue-200">Send the message</div>
                <div className="flex justify-center items-center p-1"><Input  /></div>
              </div>
            ) : (
              <img
                className="w-32 h-32 rounded-full border-4 border-blue-900 shadow-2xl object-cover bg-gray-900"
                src={user.profileImageUrl || "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"}
                alt="Profile"
              />
            )}
          </div>
          <div className="mt-2 text-center">
            <h2 className="text-2xl font-bold text-blue-200 drop-shadow mb-1">{user.name || 'User Name'}</h2>
            <p className="text-blue-400 text-sm">{user.email || 'user@email.com'}</p>
          </div>
          <div className="flex gap-6 mt-8 w-full justify-center">
            <Link to={`/follower/${id}?tabb=followers`}className="flex flex-col items-center">
              <div className="font-bold text-lg text-blue-300 flex items-center gap-1"><Users className="w-4 h-4 text-blue-500" />{follow?.followCount?.length}</div>
              <div className="text-xs text-blue-400">Followers</div>
            </Link>
            <Link to={`/follower/${id}?tabb=following`} className="flex flex-col items-center">
              <div className="font-bold text-lg text-blue-300 flex items-center gap-1"><UserPlus className="w-4 h-4 text-blue-500" />{follow?.followingCount?.length}</div>
              <div className="text-xs text-blue-400">Following</div>
            </Link>
          </div>
          <div className="mt-6 w-full flex flex-col gap-3 items-center justify-center">
            {follow?.followerData ? follow?.isUnfollowing?
            <button onClick={(e)=>e.preventDefault()}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-red-400/80 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              Unfollowing
            </button>:
            <button onClick={(e)=>unfollow(e)}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-red-400/80 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              {follow.followerData?.data?.accept?"Unfollow":"Requested"}
            </button>:
            follow?.isFollowing?
            <button onClick={(e)=>e.preventDefault()}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-red-400/80 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              Following
            </button>:

            <button onClick={(e)=>handleFollow(e)}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              {"Follow"}
            </button>}
            <button
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-green-500/90 text-white font-semibold shadow-lg hover:bg-green-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 w-full md:w-auto text-base md:text-lg"
              onClick={(e) => handleMsg(e)}
            >
              Message
            </button>
           </div>
        </div>
        <div className="flex-1 flex flex-col justify-between bg-gray-800/70 rounded-2xl shadow-xl p-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-200 mb-4 tracking-wide text-center drop-shadow">Profile</h1>
            <h3 className="text-xl font-semibold mb-2 text-purple-300">About</h3>
            <p className="text-gray-200 min-h-[60px]">{user?.bio}</p>
          </div>
          
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default User