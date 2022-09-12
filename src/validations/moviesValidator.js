const {check}= require('express-validator'); 
const db = require('../database/models')
module.exports= [
    check('title')
    .notEmpty().withMessage('El titulo no puede estar vacio').bail()
    .isLength({min:2}).withMessage("El titulo debe tener como minimo 2 letras"),
    check('rating')
    .notEmpty().withMessage("El rating no puede estar vacio").bail()
    .isNumeric().withMessage("El rating debe ser un valor numerico"),
    check('awards')
    .notEmpty().withMessage("Awards no puede estar vacio").bail()
    .isNumeric().withMessage("Awards debe ser un valor numerico"),
    check('release_date')
    .notEmpty().withMessage("Release_date no puede estar vacio").bail()
    .isDate().withMessage("Release_date debe ser una fecha"),
    check('length')
    .notEmpty().withMessage("Length no puede estar vacio").bail()
    .isNumeric().withMessage("Length debe ser un valor numerico"),
    check('genre_id')
    .notEmpty().withMessage("El rating no puede estar vacio").bail()
    .isNumeric().withMessage("El rating debe ser un valor numerico")
    .custom((value)=>{
        return db.Genre.findOne({
            where : {
             id : value
            }
          }).then(genre=>{
            if(!genre){
                return Promise.reject()

            }}
          ).catch(() => Promise.reject('No existe ese id de genero'))
        })

]