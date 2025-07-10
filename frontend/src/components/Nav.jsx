import React, { useContext, useState, useRef, useEffect } from 'react'
import { protectContext } from '../store/authStoree'
import { useTheme } from '../store/themeStore'
import { Link, useNavigate } from 'react-router-dom'

function Nav(prop) {
  const theme=useTheme()
  const protect=useContext(protectContext)
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]); // For UI only, backend logic will be handled by user
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();


  function handleInputChange(e) {
    const value = e.target.value;
    setSearch(value);
    setSearchActive(true);
    setLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setLoading(false);
      if (!value.trim()) {
        setResults([]);
        return;
      }
      const userss = await protect.searchUser(value);
      setResults(userss);
    }, 500);
  }

  function handleSearchIconClick() {
    setShowSearchBar(true);
    setTimeout(() => {
      const input = document.getElementById('nav-search-input');
      if (input) input.focus();
    }, 200);
  }

  function handleCloseSearch() {
    setShowSearchBar(false);
    setSearch('');
    setResults([]);
    setSearchActive(false);
  }

  

  return (
    <div data-theme={theme.theme} className="navbar shadow-sm bg-black border-b border-zinc-800 relative">
      <div className="navbar-start z-10">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-amber-200 hover:bg-zinc-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
          </div>
          {protect?.data?<ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-zinc-900 text-amber-200 rounded-box z-1 mt-3 w-56 p-2 shadow border border-zinc-800">
            <li><a className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" href="/">Home</a></li>
            <li><a className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" href="/profile">Profile</a></li>
            <li><a className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" href="/setting">Theme</a></li>
           <li><button onClick={()=>protect.logout()} className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" >Logout</button></li>
            
          </ul>:
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-zinc-900 text-amber-200 rounded-box z-1 mt-3 w-56 p-2 shadow border border-zinc-800">
           <li><a className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" href="/signin">Sign Up</a></li>
           <li><a className="hover:bg-zinc-800 text-lg font-semibold py-3 px-4" href="/login">Login</a></li>
          </ul>}
        </div>
      </div>
      {/* Animated Search Bar Overlay */}
      <div
        className={`absolute left-0 top-0 w-full h-full flex items-center transition-all duration-300 z-30 ${showSearchBar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{background: showSearchBar ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)', minHeight: '64px'}}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-xl mx-auto flex items-center">
            <input
              id="nav-search-input"
              type="text"
              className="w-full bg-transparent border-0 border-b-2 border-white focus:border-white outline-none text-white text-lg px-4 py-2 transition-all duration-300 placeholder:text-white"
              placeholder="Search users..."
              value={search}
              onChange={handleInputChange}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setTimeout(() => setSearchActive(false), 200)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white"
              onClick={handleCloseSearch}
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {searchActive && (
              <div className="absolute left-0 w-full bg-zinc-900 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-zinc-800 animate-fade-in" style={{ top: 'calc(100% + 8px)' }}>
                {loading ? (
                  <div className="p-4 text-center text-amber-200">Loading...</div>
                ) : results.length === 0 && search ? (
                  <div className="p-4 text-center text-amber-200">No users found</div>
                ) : (
                  results.map(user => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer"
                      onMouseDown={() => {
                        setSearch('');
                        setSearchActive(false);
                        setShowSearchBar(false);
                        navigate(`/user/${user._id}`);
                      }}
                    >
                      <img src={user.profileImageUrl || 'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp'} alt={user.name} className="w-8 h-8 rounded-full border" />
                      <span className="text-amber-200 font-medium">{user.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Hide Blab when search is active */}
      {!showSearchBar && (
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl text-amber-300 font-bold tracking-wide">Blab</a>
        </div>
      )}
      <div className="navbar-end flex items-center gap-2 z-10">
        {/* Search Icon */}
        {!showSearchBar && (
          <button className="btn btn-ghost btn-circle text-amber-200 hover:bg-zinc-900" onClick={handleSearchIconClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
          </button>
        )}
        <Link to="notification"> 
        <div className="indicator">
        <button  className="btn btn-ghost btn-circle text-amber-200 hover:bg-zinc-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
            {prop.dot?<span className="badge badge-xs bg-red-500 border-none indicator-item"></span>:null}
            </button>
          </div>
        </Link>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  )
}

export default Nav
