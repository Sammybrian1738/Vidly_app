const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 255
    },

    isGold : {
        type : Boolean, 
        default : false
    },

    phone : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 255
    }
})

const Customer = mongoose.model('customer', customerSchema)

function validateCustomer(customer){
    const schema = {
        name : Joi.string().required().min(5),
        isGold : Joi.boolean(),
        phone : Joi.string().required().min(5)
    }

    return Joi.validate(customer, schema)
}

exports.validate = validateCustomer
exports.customerSchema = customerSchema
exports.Customer = Customer
