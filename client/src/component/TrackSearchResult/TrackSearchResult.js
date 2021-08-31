import React from 'react'

export default function TrackSearchResult({track, chooseTrack}) {
  function handlePlay (){
    chooseTrack(track)
  }
  return (
    <div className="flex m-2 items-center cursor-pointer" onClick={handlePlay}>
      <img src={track.albumUrl} className="h-16 w-16" alt="" />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-gray-300">{track.artist}</div>
      </div>
    </div>
  )
}
