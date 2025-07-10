import './App.css'
import Nav from './components/Nav'
import { Navigate, Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signin from './pages/Signin'
import { connetSocket, protectContext } from './store/authStoree'
import { useContext,useEffect,useState } from 'react'
import {LoaderPinwheelIcon} from 'lucide-react'
import toast, {Toaster} from 'react-hot-toast'
import { useTheme } from './store/themeStore'
import { useMessages,MessageProvider } from './store/chatStore'

import socket from './Services/socket'
import Notification from './pages/Notification'
import User from './components/User'
import { useFollower } from './store/followerStore'
import FollowList from './pages/FollowList'

function App() {


  const protect=useContext(protectContext)
  const themee=useTheme()
  const follow=useFollower()
 
  
  const [showCustomNotification, setShowCustomNotification] = useState(false)
const [dot,setDot]=useState(false)
  // const userData=protect.data._id


  useEffect(()=>{
    if (protect.data?.data?._id) {
      follow.getRequests().then(() => {
        if (follow.requests?.data?.length > 0) {
          setDot(true)
          setShowCustomNotification(true)
          setTimeout(() => {
            setShowCustomNotification(false)
          }, 3000)
        }
      })
    }
  },[protect.data?.data?._id])


  useEffect(() => {
    protect.checkAuth();
    themee.themeChange();
  }, [protect.isLogin,protect.isSignin]);

  useEffect(()=>{
    if(!socket.connected) return
    socket.on("followed",data=>{
      toggleNotification(data)
    })
  },[socket.connected])


  const toggleNotification=(data)=>{
    if(!data?.unfollow) {
      setShowCustomNotification(true)
      setDot(true)
      setTimeout(() => {
        setShowCustomNotification(false)
      }, 2000)
    }
  }

  

  useEffect(() => {
    if (protect.data?.data?._id) {
      socket.auth = { id: protect.data.data._id };
      if(!socket.connected) socket.connect()
        socket.on("getOnlineUsers",(data)=>{
        protect.setOnlineUsers(data)
      })
    }
  }, [protect.data?.data?._id,protect?.OnlineUsers,protect.setOnlineUsers]);

  const usd=protect.onlineUsers

  if(protect.isChecking && !protect.data) return(
    <div className='flex items-center justify-center h-screen' >
      <LoaderPinwheelIcon className="size-10 animate-spin"/>
    </div>
  )




  return (
    <div data-theme={themee.theme}>
      <Nav dot={dot} setDot={setDot}/>
  
      {/* Professional Top Notification UI */}
      {showCustomNotification && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-4 shadow-lg border-b border-white/20">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">🔔</div>
                <div>
                  <div className="font-semibold text-base">New Follow Request</div>
                  <div className="text-sm opacity-90">You have received a new follow request</div>
                </div>
              </div>
              <button 
                onClick={() => setShowCustomNotification(false)}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Custom CSS for slide-down animation */}
      <style>{`
        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
  
      <Routes>
        <Route path="/" element={protect.data?<MessageProvider><Home show={setShowCustomNotification} noti={toggleNotification} dot={setDot} data={usd}/></MessageProvider>:<Navigate to="/login"/>}></Route>
        <Route path="/signin" element={!protect.data?<Signin/>:<Navigate to="/login"/>}></Route>
        <Route path="/login" element={!protect.data?<Login/>:<Navigate to="/login"/>}></Route>
        <Route path="/setting" element={protect.data?<Setting/>:<Navigate to="/login"/>}></Route>
        <Route path="/notification" element={protect.data?<Notification setDot={setDot}/>:<Navigate to="/login"/>}></Route>
        <Route path="/user/:id" element={protect.data?<User/>:<Navigate to="/login"/>}></Route>
        <Route path="/follower/:fid" element={protect.data?<FollowList/>:<Navigate to="/login"/>}></Route>
        <Route path="/profile" element={protect.data?<Profile/>:<Navigate to="/login"/>}></Route>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
