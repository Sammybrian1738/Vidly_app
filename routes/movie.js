const express = require('express')
const {Movie, validate} = require('../models/movie')
const {Genre} = require('../models/genres')
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const movies = await Movie
            .find()
            .sort({ title : 1 })

        res.status(200).send(movies)
    }
    catch(ex){
        console.log(ex.message)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.id)

        if(!movie) return res.status(404).send('Movie of given id was not found')

        res.send(movie)
    }   
    catch(ex){
        console.log(ex.message)
    }    
})

router.post('/', async (req, res) => {
    
    const {error} = validate(req.body)

    if(error) return res.status(404).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)

    if(!genre) return res.status(400).send('Invalid genre')

    const movie = new Movie({
        title : req.body.title,
        genre : {
            _id : genre._id,
            name : genre.name
        },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    })

    try{
        await movie.save()
        res.send(movie)
    }
    catch(ex){
        console.log(ex.message)
    }
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)

    if(error) return res.status(404).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)

    if(!genre) return res.status(400).send('Invalid genre')
    
    try{
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            $set : {
                title : req.body.title,
                genre : {
                    _id : genre._id,
                    name : genre.name
                },
                numberInStock : req.body.numberInStock,
                dailyRentalRate : req.body.dailyRentalRate
            }
        },{new : true})
        
        if(!movie) return res.status(404).send('Customer of given id was not found')

        res.send(movie)
    }
    catch(ex){
        res.send(ex.message)
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const movie = await Movie.findByIdAndRemove(req.params.id)

        if(!movie) return res.status(404).send('Customer of given id was not found')

        res.send(movie)
    }
    catch(ex){
        res.send(ex.message)
    }
})

module.exports = router