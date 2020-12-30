const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50
    }
})

const Genre = mongoose.model('genre', genreSchema)

function validateGenre(genre){
    const schema = {
        name : Joi.string().min(5).required()
    }

    return Joi.validate(genre, schema)
}

exports.validate = validateGenre
exports.genreSchema = genreSchema
exports.Genre = Genre