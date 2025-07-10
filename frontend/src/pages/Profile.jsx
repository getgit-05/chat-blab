import React, { useContext, useEffect, useState } from "react";
import { protectContext } from "../store/authStoree";
import { Camera, Users, UserPlus, Loader2, Edit } from 'lucide-react';
import toast from "react-hot-toast";
import { useFollower } from "../store/followerStore";
import { Link } from "react-router-dom";

function Profile() {
  const protect = useContext(protectContext);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditBio,setIsEditBio]=useState(false)
  const [bio,setBio]=useState('')
  const follow=useFollower()
  useEffect(()=>{
    setBio(protect.data?.data?.bio)

  },[])

  const handleBio=()=>{
    setIsEditBio((prev)=>!prev)
    
  }
  
  const updateBio=(e)=>{
    e.preventDefault()
    if(bio==='') return toast.error("Bio is Required !!")
    const upBio=protect.updateBio(bio)
    setIsEditBio(false)
    if(upBio) setBio(bio)

  }
  


  const handleEdit = async (e) => {
    setIsUploading(true)
    try{
      const file = e.target.files[0];
    if (!file) return;
    const read = new FileReader();
    read.readAsDataURL(file);
    read.onload = async () => {
      const ufile = read.result;
      await protect.upload({ file: ufile });
    };
    toast.success("Uploaded !!!")

    }
    catch(error){
      console.log(error)
      toast.error("Could Not upload image")

    }finally{
      setIsUploading(false)
    }
    
  };
  
  const user = protect.data?.data || {};
  const id=user?._id
  useEffect(()=>{
    follow.followerCount(user?._id)
  },[])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-2xl mx-auto bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col md:flex-row gap-8 animate-fade-in">
        {/* Sidebar */}
        <div className="flex flex-col items-center bg-gray-800/80 rounded-2xl shadow-xl p-8 md:w-1/3 w-full">
          <div className="relative mb-4">
            {isUploading?<div className="w-32 h-32 flex justify-center items-center rounded-full border-4 border-blue-900 shadow-2xl object-cover bg-gray-900"><Loader2 className="size-10 animate-spin"/></div>:
            <img
              className="w-32 h-32 rounded-full border-4 border-blue-900 shadow-2xl object-cover bg-gray-900"
              src={user.profileImageUrl || "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"}
              alt="Profile"
            />}
            <label htmlFor="image-upload" className="absolute bottom-2 right-2 cursor-pointer group">
              <div className="bg-blue-700 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center border-2 border-gray-900">
                <Camera className="w-5 h-5" />
              </div>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                onChange={handleEdit}
              />
            </label>
          </div>
          <div className="mt-2 text-center">
            <h2 className="text-2xl font-bold text-blue-200 drop-shadow mb-1">{user.name || 'User Name'}</h2>
            <p className="text-blue-400 text-sm">{user.email || 'user@email.com'}</p>
          </div>
          {/* Stats */}
          <div className="flex gap-6 mt-8 w-full justify-center">
            <Link to={`/follower/${id}?tabb=followers&back=profile`}className="flex flex-col items-center">
              <div className="font-bold text-lg text-blue-300 flex items-center gap-1"><Users className="w-4 h-4 text-blue-500" />{follow?.followCount?.length}</div>
              <div className="text-xs text-blue-400">Followers</div>
            </Link>
            <Link to={`/follower/${id}?tabb=following&back=profile`} className="flex flex-col items-center">
              <div className="font-bold text-lg text-blue-300 flex items-center gap-1"><UserPlus className="w-4 h-4 text-blue-500" />{follow?.followingCount?.length}</div>
              <div className="text-xs text-blue-400">Following</div>
            </Link>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between bg-gray-800/70 rounded-2xl shadow-xl p-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-200 mb-4 tracking-wide text-center drop-shadow">Profile</h1>
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-semibold text-purple-300 mr-2">About</h3>
              <button onClick={handleBio} className="p-1 rounded-full hover:bg-purple-800 transition-colors" title="Edit About">
                <Edit className="w-5 h-5 text-purple-400" />
              </button>
            </div>
            {!isEditBio?<p className="pt-[3px] pl-1 text-gray-200 min-h-[30px]">{bio}</p>
            :<input autoFocus placeholder="Enter Your Bioo" type="text" value={bio} onChange={(e)=>setBio(e.target.value)} className="text-gray-200 pl-1 w-full min-h-[30px]"></input>}
          </div>
         {!isEditBio?<button onClick={() => protect.logout()} className="btn bg-blue-700 hover:bg-blue-800 text-white font-semibold mt-10 w-full md:w-auto self-end shadow-lg rounded-xl">Logout</button>
          :<button onClick={(e) =>{updateBio(e)}} className="btn bg-blue-700 hover:bg-blue-800 text-white font-semibold mt-10 w-full md:w-auto self-end shadow-lg rounded-xl">Upload</button>}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default Profile;
