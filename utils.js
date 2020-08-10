function mapErrors(schemaErrors) {
    const errors = schemaErrors.map(err => {
        const {message} = err;
        return {message};
    });
    return {
        success: false,
        errors
    };
}

/**
 *
 * @param schema
 * @param {('body'|'query')} source
 * @param context
 */
function validateSchema(schema, source = 'body', context) {
    return (req, res, next) => {
        const {error} = schema.validate(req[source], {
            abortEarly: false,
            context
        });

        if (error && error.isJoi) {
            res.status(400).json(mapErrors(error.details))
        } else {
            next();
        }
    };
}

export {mapErrors, validateSchema};
