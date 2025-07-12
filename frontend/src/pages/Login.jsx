import React, { useState,useContext } from 'react'
import toast from 'react-hot-toast';
import { protectContext } from '../store/authStoree';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(true);
  const protect=useContext(protectContext)
  const navigate=useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await protect.login(formData);
     };

  const validate=()=>{
  if(!formData.email) return toast.error("Email Is required")
  if(!formData.password) return toast.error("Password Is required")
  return true
  }

  return (
    <div className="min-h-screen h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-zinc-800 flex-grow min-h-0" style={{ maxHeight: '80vh' }}>
        {/* SVG Illustration Section - Now on the left */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full">
            {/* Login SVG Illustration */}
            <svg className="max-h-[75%] w-auto mx-auto" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="320" height="320" rx="40" fill="#18181b" />
              <circle cx="160" cy="120" r="48" fill="#23232a" stroke="#f59e42" strokeWidth="4" />
              <rect x="90" y="190" width="140" height="40" rx="20" fill="#23232a" stroke="#f59e42" strokeWidth="4" />
              <rect x="120" y="205" width="80" height="10" rx="5" fill="#fbbf24" fillOpacity="0.15" />
              <rect x="140" y="110" width="40" height="8" rx="4" fill="#fbbf24" fillOpacity="0.3" />
              <circle cx="160" cy="120" r="18" fill="#f59e42" fillOpacity="0.15" />
              <rect x="150" y="130" width="20" height="8" rx="4" fill="#fbbf24" fillOpacity="0.2" />
            </svg>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 pt-4 pb-4 gap-6 h-full">
          <h2 className="text-2xl font-extrabold text-white text-center mb-2">Login to ChatApp</h2>
          <p className="text-base text-amber-200 text-center mb-3">Welcome back! Please login to continue.</p>
          <form className="flex flex-col gap-4" onSubmit={submitHandler} method="POST">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-base font-medium text-amber-100">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-5 py-3 border border-zinc-800 bg-black text-white rounded-lg shadow-sm placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setForm({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="password" className="text-base font-medium text-amber-100">Password</label>
              <input
                id="password"
                name="password"
                type={showPass ? 'password' : 'text'}
                autoComplete="current-password"
                required
                className="block w-full px-5 py-3 border border-zinc-800 bg-black text-white rounded-lg shadow-sm placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setForm({ ...formData, password: e.target.value })}
              />
              <button type="button" className="absolute inset-y-0 top-[40%] right-0 pr-3 flex items-center justify-center" onClick={() => setShowPass(!showPass)}>
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-best-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.969 9.969 0 0022 9c0 5.523-4.477 10-10 10a9.969 9.969 0 01-4.636-1.364" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-best-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 9c0 5.523-4.477 10-10 10a9.969 9.969 0 01-4.636-1.364" /></svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow text-lg font-semibold text-black bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mt-2"
            >
              Login
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-base text-amber-200">
              New user?{' '}
              <Link to="/signin" className="font-medium text-amber-400 hover:text-amber-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
