const Joi = require('joi')

function newInput() {
    return Joi.object({
        "name": Joi.string().min(2).required(),
        "Quantity": Joi.number().required(),
        "Description": Joi.string().min(10).required(),
        "price": Joi.number().integer().required(),
        "size": Joi.number().required()
    })
}

function updateInput() {
    return Joi.object({
        "name": Joi.string().min(2),
        "Quantity": Joi.number(),
        "Description": Joi.string(),
        "price": Joi.number().integer(),
        "size": Joi.number()
    })
}

function userInfo() {
    return Joi.object({
        "username": Joi.string().min(5).required(),
        "email": Joi.string().email().required(),
        "password": Joi.string().min(8).required(),
        "phone": Joi.string().min(8).required(),
        "userType": Joi.string().min(4).max(5).required()
    })
}

function userDetails() {
    return Joi.object({
        "email": Joi.string().email().required(),
        "password": Joi.string().min(8).required(),
    })
}

module.exports = {
    newInput,
    updateInput,
    userInfo,
    userDetails
}