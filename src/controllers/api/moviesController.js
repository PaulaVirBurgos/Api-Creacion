const db = require('../../database/models');
const {
    Op
} = require("sequelize");
const {
    checkID
} = require('../../helpers/index');
const {
    validationResult
} = require('express-validator');

const getURL = (req) => `${req.protocol}://${req.get('host')}${req.originalUrl}`

const moviesController = {
    list: async (req, res) => {
        let response;
        try {
            let movies = await db.Movie.findAll({
                include: ['genre']
            });
            response = {
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                    URL: getURL(req)
                },
                data: movies
            }
            return res.status(200).json(response)

        } catch (error) {
            console.log(error);
            let response = {
                ok: false,
                meta: {
                    status: 500
                },
                msg: error.message ? error.message : "comuniquese con el administrador del sitio"
            }
            return res.status(500).json(response)

        }

    },
    detail: async (req, res) => {
        if (checkID(req.params.id)) {
            return res.status(404).json(checkID(req.params.id))
        }
        let response;
        try {
            let movie = await db.Movie.findByPk(req.params.id);
            if (!movie) {
                response = {
                    ok: false,
                    meta: {
                        status: 404
                    },
                    msg: "No se encuentra la pelicula con ese id"
                }
                return res.status(400).json(response)
            }
            response = {
                ok: true,
                meta: {
                    status: 200,
                    URL: getURL(req)
                },
                data: movie
            }
            return res.status(200).json(response)

        } catch (error) {
            console.log(error);
            let response = {
                ok: false,
                meta: {
                    status: 500
                },
                msg: error.message ? error.message : "comuniquese con el administrador del sitio"
            }
            return res.status(500).json(response)

        }

    },

    recomended: async (req, res) => {
        let response;
        try {

            let movies = await db.Movie.findAll({
                include: ["genre"],
                where: {
                    rating: {
                        [Op.gte]: +req.query.rating || 8
                    }
                },
                order: [
                    ["rating", "DESC"]
                ]
            })
            response = {
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                    URL: getURL(req)

                },
                data: movies
            }
            return res.status(200).json(response)


        } catch (error) {
            console.log(error);
            let response = {
                ok: false,
                meta: {
                    status: 500
                },
                msg: error.message ? error.message : "comuniquese con el administrador del sitio"
            }
            return res.status(500).json(response)

        }

    },
    nuevo: async (req, res) => {
        let response;
        try {
            let movies = await db.Movie.findAll({
                order: [
                    ["release_date", "DESC"]
                ],
                limit: +req.query.limit || 5
            })
            response = {
                ok: true,
                meta: {
                    status: 200,
                    URL: getURL(req)
                },
                data: movies
            }
            return res.status(200).json(response)
        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500
                },
                msg: error.message ? error.message : "comuniquese con el administrador del sitio"
            }
            return res.status(500).json(response)

        }
    },

    create: async (req, res) => {
       
        const errors = validationResult(req);
        let response; 
       
      
        if (errors.isEmpty()) {
            const {
                title,
                rating,
                awards,
                release_date,
                length,
                genre_id
            } = req.body

          
            try {
                let newMovie = await db.Movie.create({
                    title: title.trim(),
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id,
                    
                  })
                 
                if (newMovie) {
                    response = {
                        ok: true,
                        meta: {
                            status: 200,
                            url: getURL(req) + '/' + newMovie.id
                        },
                        data: newMovie
                    };
                    return res.status(200).json(response);
                }
            } catch (error) {

         let response = {
                ok: false,
                meta: {
                    status: 500
                },
                msg: error.message ? error.message : "comuniquese con el administrador del sitio"
            }
            return res.status(500).json(response)

            }
        }else{
            let response = {
                ok: false,
                meta: {
                    status: 400
                },
                msg: "Validaciones incorrectas",
                errors
            }
            return res.status(500).json(response)
        }
    },


    update: async(req, res) => {
        let response; 
        
        let movieId = req.params.id;

        const errors = validationResult(req); 
        if(errors.isEmpty()){
            const {
                title,
                rating,
                awards,
                release_date,
                length,
                genre_id
            } = req.body

            try {
                 let movieEdit= await db.Movie.update({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length,
                genre_id, 
            }, {
                where: {
                    id: movieId
                }
            })
            response ={
          
                    ok: true,
                    meta: {
                        status: 200,
                        url: getURL(req) 
                    },
                    data: req.body
                
            }
            return res.status(200).json(response)
            } catch (error) {
                    response = {
                    ok: false,
                    meta: {
                        status: 500
                    },
                    msg: error.message ? error.message : "comuniquese con el administrador del sitio"
                }
                return res.status(500).json(response)
            }
        }else{
                let response = {
                ok: false,
                meta: {
                    status: 400
                },
                msg: "Validaciones incorrectas",
                errors
            }
            return res.status(500).json(response)
        }
       
           
    },

    destroy: async (req, res) => {
        try {

            let movies = await db.Movie.findAll()
            let moviesIds = movies.map(movie => movie.id)
            
            if(!moviesIds.includes(+req.params.id)){
              let error = new Error('Id de pelicula inexistente')
              error.status = 404
              throw error
            }else{
                let statusDestroy = await db.Movie.destroy(
              { where: { id: req.params.id }, force: false })
              
      return res.send(statusDestroy)
            }
            
            
              if(statusDestroy==1){
                let response = {
                  ok: true,
                  meta: {
                    status: 100,
                  },
                  msg: "Eliminada con exito",
                  statusDestroy
                }
                return res.status(100).json(response)
              }else{
                let response = {
                  ok: true,
                  meta: {
                    status: 200,
                  },
                  msg: "no se hicieron cambios",
                  statusDestroy
                }
                return res.status(200).json(response)
              }
             
          } catch (error) {
            console.log(error);
            let response = {
              ok: false,
              meta: {
                status: 500,
              },
              msg: error.message ? error.message : "Comuniquese con el administrador",
            };
            return res.status(500).json(response);
          }
    }
}

module.exports = moviesController;5