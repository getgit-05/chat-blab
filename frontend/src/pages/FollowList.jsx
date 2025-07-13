import React, { useEffect, useState } from "react";
import { Users, UserPlus, UserMinus, ArrowLeft } from "lucide-react";
import { useFollower } from "../store/followerStore";
import { Link, useParams, useSearchParams } from "react-router-dom";


function FollowList() {
  const {fid}=useParams()
  const [tab, setTab] = useState("followers");
  const follow=useFollower()
  const [searchParams]=useSearchParams()
  const tabb=searchParams.get("tabb")
  const back=searchParams.get("back")
  useEffect(()=>{
    if(fid) follow.followerCount(fid)
    setTab(tabb)
  },[fid])
  const users = tab === "followers" ? follow?.followCount: follow?.followingCount;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 scroll-auto p-6">
      <div className=" h-screen scroll-auto w-full max-w-2xl mx-auto bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link to={back==='profile'?'/profile':`/user/${fid}`} className="p-2 rounded-full hover:bg-blue-900/40 transition" title="Back">
            <ArrowLeft className="w-6 h-6 text-blue-400" />
          </Link>
          <h1 className="text-3xl font-extrabold text-blue-200 tracking-wide drop-shadow">Connections</h1>
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg text-lg ${tab === "followers" ? "bg-blue-700 text-white" : "bg-gray-800 text-blue-300 hover:bg-blue-800/60"}`}
            onClick={() => setTab("followers")}
          >
            <Users className="inline w-5 h-5 mr-2" /> Followers
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg text-lg ${tab === "following" ? "bg-purple-700 text-white" : "bg-gray-800 text-purple-300 hover:bg-purple-800/60"}`}
            onClick={() => setTab("following")}
          >
            <UserPlus className="inline w-5 h-5 mr-2" /> Following
          </button>
        </div>
        {/* User List */}
        <div className="flex flex-col gap-5 max-h-128 overflow-y-auto pr-2 custom-scrollbar">
          {tab==="followers"?users?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-70">
              <span className="text-4xl mb-2">✨</span>
              <p className="text-blue-200 font-semibold">No {tab} yet</p>
            </div>
          ) : (
            users?.map((user) => (
              <div
                key={user?.follower?._id}
                className="flex items-center gap-4 bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-gray-900/60 rounded-2xl shadow-lg px-6 py-4 border-l-4 border-blue-700/60 animate-slide-in"
              >
                <img
                  src={user?.follower?.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"}
                  alt={user?.follower?.name}
                  className="w-14 h-14 rounded-full border-2 border-blue-900 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-blue-100 font-medium text-lg truncate">{user?.follower?.name}</div>
                  <div className="text-purple-200 text-sm truncate">{user?.follower?.name}</div>
                </div>
                
                  <Link to={`/user/${user?.follower?._id}`}  className="bg-purple-700/80 hover:bg-purple-800/90 text-white rounded-full px-4 py-2 shadow font-semibold transition flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> View
                  </Link>
                
              </div>
            ))
          ): users?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-70">
              <span className="text-4xl mb-2">✨</span>
              <p className="text-blue-200 font-semibold">No {tab} yet</p>
            </div>
          ) : (
            users?.map((user) => (
              <div
                key={user?.following?._id}
                className="flex items-center gap-4 bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-gray-900/60 rounded-2xl shadow-lg px-6 py-4 border-l-4 border-blue-700/60 animate-slide-in"
              >
                <img
                  src={user?.following?.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg" }
                  alt={user?.following?.name}
                  className="w-14 h-14 rounded-full border-2 border-blue-900 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-blue-100 font-medium text-lg truncate">{user?.following?.name}</div>
                  <div className="text-purple-200 text-sm truncate">{user?.following?.name}</div>
                </div>
                 
                  <Link to={`/user/${user?.following?._id}`} className="bg-purple-700/80 hover:bg-purple-800/90 text-white rounded-full px-4 py-2 shadow font-semibold transition flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> View
                  </Link>
                
              </div>
            ))
          )}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: none; } }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default FollowList; 