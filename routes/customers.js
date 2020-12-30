const express = require('express')
const {Customer, validate} = require('../models/customer')
const router = express.Router()

router.get('/', (req, res) => {
    async function listCustomers(){
        try{
            const customers = await Customer
                        .find()
                        .sort({ name : 1})

            res.status(200).send(customers)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    listCustomers()
})

router.get('/:id', (req, res) => {
    async function getCustomer(){
        
        customerId = req.params.id

        try{
            const customer = await Customer.findById(customerId)

            if(!customer) return res.status(404).send('Customer of given id was not found')

            res.status(200).send(customer)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    getCustomer()
})

router.post('/', (req, res) => {
    async function createCustomer(){
        const { error } = validate(req.body)

        if(error) return res.send(error.details[0].message)

        const customer = new Customer({
            name : req.body.name,
            isGold : req.body.isGold,
            phone : req.body.phone
        })
    
        try{
            await customer.save()
            res.send(customer)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    createCustomer()
})

router.put('/:id', (req, res) => {
    async function updateCustomer(){
        const {error} = validate(req.body)

        if(error) return res.send(error.details[0].message)

        try{
            const customer = await Customer.findByIdAndUpdate(req.params.id, {
                $set : {
                    name : req.body.name,
                    isGold : req.body.isGold,
                    phone : req.body.phone
                }
            }, {new : true})

            if(!customer) return res.status(404).send('Customer of given id was not found')

            res.send(customer)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    updateCustomer()
})

router.delete('/:id', (req, res) => {
    async function removeCustomer(){
        try{
            const customer = await Customer.findByIdAndRemove(req.params.id)

            if(!customer) return res.status(404).send('Customer of given id was not found')

            res.send(customer)
        }
        catch(ex){
            console.log(ex.message)
        }
    }
    removeCustomer()
})

module.exports = router