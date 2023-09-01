const axios = require("axios");
const express = require("express");
const app = express();
const { puerto, ip, protocolo, ruta } = require("./info.json");

const enlace = require("../util/enlace.js");

const servidores = Object.keys(ruta);
const lyrics_service = "microservicio_letra";
const songs_service = "microservicio_data";

const url_lyrics = enlace(
  protocolo[lyrics_service],
  ip[lyrics_service],
  puerto[lyrics_service]
);

const url_songs = enlace(
  protocolo[songs_service],
  ip[songs_service],
  puerto[songs_service]
);

app.get("/artist-lyrics", async (req, res) => {
  if (req.query.name) {
    const artist_songs = (
      await axios.get(url_songs + `?name=${req.query.name}`)
    ).data;

    const response_json = {};
    console.log(artist_songs.result.songs);

    response_json.songs = [];

    for (song of artist_songs.result.songs) {
      // console.log(song)
      const lyrics = (await axios.get(url_lyrics + `?name=${song.name}`)).data;
      console.log(lyrics);

      response_json.songs.push({
        [song.name]: {
          release_date: song.release_date,
          duration: song.duration,
          lyrics: lyrics.result,
        },
      });
    }

    response_json.artist = req.query.name;
    res.json(response_json);
  } else {
    res.json({});
  }
});


app.listen(puerto["gateway"], () => {
  console.log(
    `App listening at ${enlace(
      protocolo["gateway"],
      ip["gateway"],
      puerto["gateway"]
    )}`
  );
});
