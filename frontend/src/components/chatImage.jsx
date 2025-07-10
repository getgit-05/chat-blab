import React from 'react'

function Image() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-bounce flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 15.75a2.25 2.25 0 01-2.25 2.25H6.768l-3.018 2.263A.75.75 0 012 19.75v-13.5A2.25 2.25 0 014.25 4h15a2.25 2.25 0 012.25 2.25v9.5z" />
        </svg>
        <span className="mt-4 text-lg text-white font-semibold">Start a conversation !</span>
      </div>
    </div>
  )
}

export default Image
