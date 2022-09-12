const express = require('express');
const router = express.Router();
const moviesValidator= require('../../validations/moviesValidator')
const {list,recomended,detail,nuevo, create,update,destroy} = require('../../controllers/api/moviesController');

router.get('/movies', list);
router.get('/movies/recommended', recomended);
router.get('/movies/ne', nuevo);
router.get('/movies/:id',detail);
router.post('/movies',moviesValidator,create);
router.put('/movies/update/:id', update);
router.delete('/movies/:id', destroy);

module.exports = router;