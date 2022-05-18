const handler = (err, _req, res, next) => {
    if (res.headersSent) return next(err);
    if(!err) return next();
    if (["UnauthorizedError", "JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
        return res.status(401).send({
            message: err.message,
            code: err.code
        });
    }
    if (err.code === "ER_DUP_ENTRY"){
        return res.status(409).send({
            message: err.sqlMessage
        })
    }
    if (err.code === "argument_missing" || err.code === "field_missing"){
        return res.status(400).send({ message: err.message })
    }
    if (err.code === "nonexist_id"){
        return res.status(404).send({ message: "Resource not found"})
    }
    if (err.code === "unauthorized_action"){
        return res.status(403).send({ message: err.message })
    }
    if (err.name === "TypeError"){
        console.log(err)
        return res.status(400).message({ message: err.message })
    }

    console.log(err)
    res.status(500);
    res.send('500: Internal server error');
}

class MissingArgumentError extends Error {
    constructor(message){
        super(message)
        this.name = "MissingArgumentError"
        this.code = "argument_missing"
    }
}

class BodyRequiredError extends Error {
    constructor(message){
        super(message)
        this.name = "BodyFieldMissing"
        this.code = "field_missing"
    }
}

class IdMatchNoEntry extends Error {
    constructor(message){
        super(message)
        this.name = "IdMatchNoEntry"
        this.code = "nonexist_id"
    }
}

class BadCredentialsError extends Error {
    constructor(message){
        super(message)
        this.name = "BadCredentialsError"
        this.code = "bad_credentials"
    }
}

class UnauthorizedActionError extends Error {
    constructor(message){
        super(message)
        this.name = "UnauthorizedActionError"
        this.code = "unauthorized_action"
    }
}

class UnauthorizedError extends Error {
    constructor(message){
        super(message)
        this.name = "UnauthorizedError"
        this.code = "unauthorized"
    }
}

module.exports = {
    handler: handler,
    MissingArgumentError: MissingArgumentError,
    BodyRequiredError: BodyRequiredError,
    IdMatchNoEntry: IdMatchNoEntry,
    BadCredentialsError: BadCredentialsError,
    UnauthorizedActionError: UnauthorizedActionError,
    UnauthorizedError: UnauthorizedError
}
