require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const lyricsFinder = require('lyrics-finder');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//fixing cors errors
app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

app.post('/refresh', (req, res) =>{
  const refreshToken = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri ,
    clientId: clientId ,
    clientSecret: clientSecret,
    refreshToken,
  })
  spotifyApi.refreshAccessToken().then(
    (data) =>{
      res.json({
        accessToken:data.body.accessToken,
        expiresIn: data.body.expiresIn
      })
    }).catch(()=>{
      res.sendStatus(400)
    })
})


app.post('/login', (req, res) =>{
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri ,
    clientId: clientId ,
    clientSecret: clientSecret ,
  })

  spotifyApi.authorizationCodeGrant(code).then(data =>{
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    })
  })
  .catch((error) =>{
    console.log(error)
    res.sendStatus(400)
  })
})

app.get('/lyrics', async (req, res)=>{
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics available"
  res.json({lyrics})
})
app.listen(3001);



