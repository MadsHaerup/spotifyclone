import React, { useEffect,useState } from 'react'
import useAuth from '../../component/UseAuth/useAuth'
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from '../../component/TrackSearchResult/TrackSearchResult';
import Player from '../../component/Player/Player';
import axios from 'axios';

const clientID = process.env.REACT_APP_CLIENT_ID;

const spotifyApi = new SpotifyWebApi({
  clientId: clientID,
})

export default function Dashboard({code}) {
  const [search, setSearch] = useState('');
  const accessToken = useAuth(code);
  const [searchResults, setSearchResults]=useState([]);
  const [playingTrack, setPlayingTrack]=useState();
  const [lyrics, setLyrics]=useState('');

  function chooseTrack(track){
    setPlayingTrack(track)
    setSearch('')
    setLyrics('')
  }

  useEffect(() => {
    if(!playingTrack) return
    axios.get('http://localhost:3001/lyrics',{
      params:{
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res =>{
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

  useEffect(() => {
    if(!accessToken)return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])
  
  useEffect(() => {
    if(!search) return setSearchResults([])
    if(!accessToken) return

    let cancel = false;

    spotifyApi.searchTracks(search).then(res =>{
      if(cancel) return;
      setSearchResults(res.body.tracks.items.map(track =>{
        const smalletsAlbumImage = track.album.images.reduce(
          (smallest, image) =>{
            if(image.height < smallest.height) return image 
            return smallest
          }
        )
        return{
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smalletsAlbumImage.url
        }
      }))
    })
    return () => cancel = true;
  }, [search, accessToken])
  

  return (
    <div className="container mx-auto px-4 h-screen flex-col ">
      <input 
      className="my-4 border-2 w-full"
      type="search" 
      name="" 
      id="" 
      placeholder="search songs/artists" 
      value={search}
      onChange={(e)=> setSearch(e.target.value) }
      />

      <div className="my-2 flex-grow">
        {
          searchResults.map((track)=>(
            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
          ))
        }
        {searchResults.length === 0 &&(
          <div className="text-center whitespace-pre">
            {lyrics}
          </div>
        )}
      </div>
      <div> <Player accessToken={accessToken} trackUri={playingTrack?.uri} /> </div>
    </div>
  )
}
