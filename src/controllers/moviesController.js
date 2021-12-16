const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': async  (req, res) => {
        try{
            let pelicula = await db.Movie.findOne({
                where: {
                  id: +req.params.id,
                },
                include: [
                  { association: "genre" }
                ],
              });
              res.render('moviesDetail.ejs', {
                  movie: pelicula
                });
        }catch(error){
            console.log(error)
        }
        
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async (req, res) =>{
        try{
            let genres = await db.Genre.findAll();
            return res.render("moviesAdd",{
                allGenres : genres
            });   
        }catch(error){
            console.log(error);
        }
    },
    create: async (req, res) =>{
        try{
            let pelicula = await db.Movie.create({
                title: req.body.title,
                rating: req.body.rating,
                length: req.body.length,
                awards: req.body.awards,
                release_date: req.body.release_date,
                genre_id: req.body.genre_id
              });
              res.redirect("/movies");
        }catch(error){
            console.log(error)
        }
    },
    edit: async (req, res) =>{
        try{
            let genres = await db.Genre.findAll();
            let pelicula = await db.Movie.findOne({
                where: {
                  id: +req.params.id,
                },
                include: [
                  { association: "genre" }
                ],
              });
            return res.render("moviesEdit",{
                Movie: pelicula,
                allGenres : genres
            });
        }catch(error){
            console.log(error);
        }
        
    },
    update: async (req,res)=> {
        try{
            let pelicula = await db.Movie.update({
                title: req.body.title,
                rating: req.body.rating,
                length: req.body.length,
                awards: req.body.awards,
                release_date: req.body.release_date,
                genre_id : req.body.genre_id
              },
              {
                where: {
                  id: +req.params.id,
                },
              });
              res.redirect("/movies");
        }catch(error){
            console.log(error)
        }
    },
    destroy: async (req, res)=> {
        try{
            await db.Movie.destroy({
                where: {
                  id: +req.params.id,
                },
              });
              res.redirect("/movies");
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = moviesController;