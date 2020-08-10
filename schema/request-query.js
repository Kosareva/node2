import joi from "joi";

const schema = joi.object().keys({
    sortBy: joi.string(),
    limit: joi.number().min(1),
    substr: joi.string()
});

export default schema;
