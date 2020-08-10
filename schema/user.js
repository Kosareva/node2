import joi from "joi";

const schema = joi.object().keys({
    id: joi.when('$isUpdate', {
        is: joi.boolean().valid(true).required(),
        then: joi.forbidden(),
        otherwise: joi.string().guid()
    }),
    login: joi.when('$isUpdate', {
        is: joi.boolean().valid(true).required(),
        then: joi.string().alphanum().min(3).max(30),
        otherwise: joi.string().alphanum().min(3).max(30).required()
    }),
    password: joi.when('$isUpdate', {
        is: joi.boolean().valid(true).required(),
        then: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        otherwise: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }),
    age: joi.number().integer().min(4).max(130),
    isDeleted: joi.forbidden()
});

export default schema;
