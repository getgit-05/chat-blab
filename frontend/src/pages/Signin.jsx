import { Eye, EyeOff } from 'lucide-react'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { protectContext } from '../store/authStoree'
import { Link } from 'react-router-dom'

function Signin() {

    const[formData,setForm]=useState({
        name:"",
        email:"",
        password:"",

    })

    const protect=useContext(protectContext)
    const[showPass,setShowPass]=useState(true)

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await protect.signin(formData);
    }
    const validate=()=>{
        if(!formData.name.trim()) return toast.error("Full Name Is Required")
        if(!formData.email.trim()) return toast.error("Email Is Required")
        if(!formData.password) return toast.error("Password Is Required")
        if(formData.password.length<8) return toast.error("Password must me at least 8 characters")

        return true

    }
    
  return (
    <div className="min-h-screen h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-zinc-800 flex-grow min-h-0" style={{maxHeight: '80vh'}}>
     
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 pt-4 pb-4 gap-5 h-full">
          <h2 className="text-2xl font-extrabold text-white text-center mb-1">Sign up for ChatApp</h2>
          <p className="text-base text-amber-200 text-center mb-2">Create your account to start chatting!</p>
          <form className="flex flex-col gap-4" onSubmit={submitHandler} method="POST">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-base font-medium text-amber-100">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="block w-full px-5 py-3 border border-zinc-800 bg-black text-white rounded-lg shadow-sm placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                placeholder="Enter your full name"
                value={formData.name }
                onChange={(e)=>setForm({...formData,name:e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-base font-medium text-amber-100">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-5 py-3 border border-zinc-800 bg-black text-white rounded-lg shadow-sm placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                placeholder="Enter your email"
                value={formData.email }
                onChange={(e)=>setForm({...formData,email:e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="password" className="text-base font-medium text-amber-100">Password</label>
              <input
                id="password"
                name="password"
                type={showPass?"password":"text"}
                autoComplete="current-password"
                required
                className="block w-full px-5 py-3 border border-zinc-800 bg-black text-white rounded-lg shadow-sm placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                placeholder="Create a password"
                value={formData.password }
                onChange={(e)=>setForm({...formData,password:e.target.value})}
              />
              <button type="button" className='absolute inset-y-0 top-[40%] right-0 pr-3 flex items-center justify-center'>{showPass?<EyeOff onClick={()=>setShowPass(!showPass)} className='size-5 text-best-content/40'/>:
              <Eye onClick={()=>setShowPass(!showPass)}  className='size-5 text-best-content/40'/>}</button>
              
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow text-lg font-semibold text-black bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mt-2"
            >
              Sign up
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-base text-amber-200">
              Already a user?{' '}
              <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full">
          
            <svg className="max-h-[75%] w-auto mx-auto" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="320" height="320" rx="40" fill="#18181b" />
              <rect x="60" y="80" width="200" height="120" rx="24" fill="#23232a" stroke="#f59e42" strokeWidth="4" />
              <rect x="80" y="110" width="160" height="20" rx="10" fill="#fbbf24" fillOpacity="0.15" />
              <rect x="80" y="140" width="100" height="20" rx="10" fill="#fbbf24" fillOpacity="0.15" />
              <circle cx="100" cy="180" r="10" fill="#f59e42" />
              <circle cx="130" cy="180" r="10" fill="#f59e42" />
              <circle cx="160" cy="180" r="10" fill="#f59e42" />
              <rect x="200" y="170" width="30" height="10" rx="5" fill="#fbbf24" fillOpacity="0.15" />
              <rect x="60" y="210" width="80" height="16" rx="8" fill="#f59e42" fillOpacity="0.08" />
              <rect x="150" y="210" width="40" height="16" rx="8" fill="#f59e42" fillOpacity="0.08" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
