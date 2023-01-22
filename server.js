/*********************************************************************************
* BTI425 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Gazal Garg        Student ID: 107140212        Date: January 19, 2023
*
* Cyclic Link: 
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var cors = require("cors");
require("dotenv").config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

var app = express();
app.use(express.json())

app.use(cors());

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.json({"message": "API Listening!"});
});

// add new "Movie" document to the collection
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
    .then(()=>{
    res.status(201).json({ message: `added a new item: ${req.body.title}` })
    })
    .catch((err)=>{
        res.status(400).json(err);
    })
});

// get all movie objects based on the parameters
app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movies)=>{
        res.status(200).json(movies);
    })
    .catch((err)=>{
        res.status(404).json(`Error! No movies retrieved`)
    })
  });

// return a specific "Movie" object to the client
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
    .then((movies)=>{
        res.status(200).json(movies);
    })
    .catch((err)=>{
        res.status(404).json(`Error! No movies retrieved`)
    })
  });

// update a specific "Movie" document
app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
    .then(()=>{
        res.json({message: `updated movie with id: ${req.params.id}`});
    })
    .catch((err)=>{
        res.status(404).json(`Error! Updation aborted`)
    })
  });

// delete a "Movie" document from the collection
app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
    .then(()=>{
        res.status(200).json({ message: `deleted user with identifier: ${req.params.id}` });
    })
    .catch((err)=>{
        res.status(404).json(`Error! Deletion aborted`)
    })
  });


app.use((req, res) => {
    res.status(404).send("Sorry! Page not found");
  });

// setup http server to listen on HTTP_PORT
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
});