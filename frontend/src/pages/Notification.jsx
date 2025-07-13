import React, { useEffect, useState } from 'react';
import { UserPlus, Users, Check, X, User, Loader } from 'lucide-react';
import { useFollower } from '../store/followerStore';
import socket from '../Services/socket';
import { useMessages } from '../store/chatStore';
import { useNavigate } from 'react-router-dom';


function Notification(prop) {

  const follow=useFollower()
  const msg=useMessages()
  const navigate=useNavigate()

  const [acceptId,setAcceptId]=useState(null)
  const [rejectId,setRejectId]=useState(null)
  useEffect(()=>{
    follow.getRequests()
    msg.suggestUser()
    prop.setDot(false)
  },[])
  

  useEffect(()=>{
    follow.getRequests()
  },[follow?.isDelReq,follow?.isAccepting,follow.setIsRequesting,follow.setIsUnfollowing])


  


  useEffect(()=>{
    if(!socket.connected) return
    socket.on("followed",(red)=>{
        follow.setIsRequesting(true)
        follow.setIsUnfollowing(true)
        follow.getRequests()
        follow.setIsRequesting(false)
        follow.setIsUnfollowing(false)  
    })

    return ()=> {
        socket.off("followed")
    }

},[socket.connected])

  const handleDelete=(e,id)=>{
    e.preventDefault()
    setRejectId(id)
    follow.deleteReq(id)
  }

  const handleAccept=(e,id)=>{
    e.preventDefault()
    setAcceptId(id)
    follow.acceptReq(id)
  }

  const suggestedFollowers=msg?.suggestUsers

  const followRequests=follow?.requests?.data
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-2xl mx-auto bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col gap-10 animate-fade-in">
        {/* Follow Requests Section */}
        <section>
          <h2 className="text-2xl font-bold text-blue-200 mb-4 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-400" /> Follow Requests
          </h2>
          {followRequests?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-70">
              <span className="text-4xl mb-2">🤝</span>
              <p className="text-blue-200 font-semibold">No new follow requests</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {followRequests?.map((user, i) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 bg-gray-800/80 rounded-2xl shadow-lg px-6 py-4 border-l-4 border-blue-700 animate-slide-in"
                  style={{
                    transform: `translateY(-${i * 10}px) scale(${1 - i * 0.02})`,
                    zIndex: followRequests.length - i,
                  }}
                >
                  <img src={user?.followedBy?.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"} alt={user?.followedBy?.name} className="w-12 h-12 rounded-full border-2 border-blue-900 shadow" />
                  <div className="flex-1">
                    <div className="text-blue-100 font-medium text-lg">{user.followedeBy?.name}</div>
                    <div className="text-purple-100 font-medium text-lg">{user.followedBy.name}</div>
                  </div>
                  <div className="flex gap-2">
                  {follow?.isAccepting && acceptId===user._id ?<button onClick={(e)=>handleAccept(e,user._id)} className="bg-green-900/30 hover:bg-green-800/60 text-green-300 rounded-full p-2 shadow transition" title="Accept">
                     <Loader className="animate-spin w-5 h-5" />
                    </button>:
                    <button onClick={(e)=>handleAccept(e,user._id)} className="bg-green-900/30 hover:bg-green-800/60 text-green-300 rounded-full p-2 shadow transition" title="Accept">
                     <Check className="w-5 h-5" />
                    </button>}
                    {follow?.isDelReq && rejectId===user._id ?<button onClick={(e)=>handleDelete(e,user._id)} className="bg-red-900/30 hover:bg-red-800/60 text-red-300 rounded-full p-2 shadow transition" title="Decline">
                      <Loader className="w-5 h-5 animate-spin"/>
                    </button>:
                    <button onClick={(e)=>handleDelete(e,user._id)} className="bg-red-900/30 hover:bg-red-800/60 text-red-300 rounded-full p-2 shadow transition" title="Decline">
                      <X className="w-5 h-5" />
                    </button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Divider */}
        <div className="w-full flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900" />
          <span className="text-gray-500 text-sm font-semibold">Suggestions</span>
          <div className="flex-1 h-px bg-gradient-to-l from-blue-900 via-purple-900 to-gray-900" />
        </div>
        {/* Suggested Followers Section */}
        <section>
          <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> Suggested Followers
          </h2>
          {suggestedFollowers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-70">
              <span className="text-4xl mb-2">✨</span>
              <p className="text-purple-200 font-semibold">No suggestions right now</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {suggestedFollowers?.map((sug, i) => (
                <div
                  key={sug._id}
                  className="flex items-center gap-4 bg-gray-800/80 rounded-2xl shadow-lg px-6 py-4 border-l-4 border-purple-700 animate-slide-in"
                  style={{
                    transform: `translateY(-${i * 10}px) scale(${1 - i * 0.02})`,
                    zIndex: suggestedFollowers.length - i,
                  }}
                >
                  <img src={sug.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"} alt={sug.name} className="w-12 h-12 rounded-full border-2 border-purple-900 shadow" />
                  <div className="flex-1">
                    <div className="text-purple-100 font-medium text-lg">{sug.name}</div>
                  </div>
                  <button onClick={()=>navigate(`/user/${sug._id}`)} className="bg-purple-900/30 hover:bg-purple-800/60 text-purple-200 rounded-full px-4 py-2 shadow font-semibold transition flex items-center gap-2">
                    <User className="w-4 h-4" /> View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default Notification;
