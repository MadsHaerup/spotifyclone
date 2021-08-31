import React from 'react';

const clientId  = process.env.REACT_APP_CLIENT_ID;

const AUTH_URL = `
https://accounts.spotify.com/authorize?client_id=${clientId}
&response_type=code&redirect_uri=http://localhost:3000
&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

export default function Login() {
  return (
    <div className="container mx-auto px-4 grid place-items-center h-screen">
     <a href={AUTH_URL} className="rounded-md text-white bg-green-500 px-4 py-2 text-lg ">
      Login with spotify
     </a>
    </div>
  )
}
