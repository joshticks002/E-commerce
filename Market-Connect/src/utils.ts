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

module.exports = {
    newInput,
    updateInput
}