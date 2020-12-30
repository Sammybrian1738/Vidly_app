const express = require('express')
const {Genre, validate} = require('../models/genres')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')

router.get('/', (req, res, next) => {
    async function listGenres(){
        const genres = await Genre
            .find()
            .sort({name : 1})

        res.status(200).send(genres)
    }
    listGenres()
})

router.get('/:id', (req, res) => {
    async function getGenre(){
        try{
            const genre = await Genre.findById(req.params.id)
    
            if(!genre) return res.status(404).send('Genre of given id was not found')
    
            res.status(200).send(genre)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    getGenre()
})

router.post('/', auth, (req, res) => {
    async function createGenre(){
        const { error } = validate(req.body)

        if(error) return res.status(400).send(error.details[0].message)

        const genre = new Genre({
            name : req.body.name
        })

        try{
            await genre.save()
            res.send(genre)
        }
            catch(ex){
            console.log(ex.message)
        }
    }  
    createGenre()
})

router.put('/:id', (req, res) => {
    async function updateGenre(){
        const { error } = validate(req.body)
    
        if(error) return res.status(400).send(error.details[0].message)
    
        try{
            const genre = await Genre.findByIdAndUpdate(req.params.id,{
                $set : {
                    name : req.body.name
                }
            },{new : true})
    
            if(!genre) return res.status(404).send('genre of given id was not found')
    
            res.send(genre)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    updateGenre()
})

router.delete('/:id', [auth, admin], (req, res) => {
    async function removeGenre(){
        try{
            const genre = await Genre.findByIdAndRemove(req.params.id)

            if(!genre) return res.status(404).send('genre of given id was not found')

            res.send(genre)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    removeGenre() 
})

module.exports = router;