require("dotenv").config();

const express = require("express");
const app = express();
const port = require("./info.json")["puerto"]["microservicio_data"];
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const songs = client.db("songs");
const songs_detailed_info = songs.collection("songs_detailed_info");
const toMinutesAndSeconds = require("../util/toMinutesAndSeconds")


//get song lists of author
app.get("/", async (req, res) => {
  const author_name = req.query.name;

  if (author_name) {
    const query = { artists: { $regex: author_name } };
    console.log(query)
    if ((await songs_detailed_info.countDocuments(query)) === 0) {
      res.send({ result: null, status: "Author not found" });
    } else {
      const song_result = await songs_detailed_info.find(query, {
        release_date: 1,
        duration_ms: 1,
      });
      const results = [];

      for await (song of song_result) {
        // console.log(song.duration);

        results.push({
          name: song.name,
          release_date: song.release_date,
          duration: toMinutesAndSeconds(song.duration_ms),
        });
      }

      res.json({
        result: { artist: author_name, songs: results },
        status: "Found",
      });
    }
  } else {
    res.send({ result: null, status: "Missing name" });
  }
});

//get sound detailed info
app.get("/song-detailed-info", async (req, res) => {
  const song_name = req.query.name;

  if (song_name) {
    const query = { name: song_name };

    console.log(query);
    if ((await songs_detailed_info.countDocuments(query)) === 0) {
      res.send({ result: "", status: "Song not found" });
    } else {
      const song_result = await songs_detailed_info.findOne(query, {
        release_date: 1,
        duration_ms: 1,
      });

      res.send({
        result: {
          name: song_name,
          release_date: song_result.release_date,
          duration: toMinutesAndSeconds(song_result.duration_ms),
        },
        status: "Found",
      });
    }
  } else {
    res.send({ result: "", status: "Missing name" });
  }
});

app.listen(port, () => console.log("Listo"));
