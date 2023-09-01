require('dotenv').config()

const express = require("express")
const app = express()
const port = require ("./info.json")['puerto']['microservicio_letra'];;
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);



const songs = client.db('songs');
const songs_info = songs.collection('songs_info');



app.get('/',async (req,res) => {
    const song_name = req.query.name;
    // console.log(song_name)

    if(song_name){
        const query = {"song": song_name};
        console.log(query);
        if((await songs_info.countDocuments(query)) === 0){
            res.send({result: "",status: "Song not found"});
        }
        else{
            const song_result = await songs_info.findOne(query);

            console.log(song_result);
            res.send({result:song_result.text,status: "Found"});
        }
   }
    else {

        res.send({result:"",status: "Missing name"})
    }
    


})

app.listen(port,() => console.log('Listo') )