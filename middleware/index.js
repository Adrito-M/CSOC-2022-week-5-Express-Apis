const { Token } = require("../models");

const validateToken = async (req, res, next) => {
    const ignored_paths = [
        '/login', 
        '/login/',
        '/register',
        '/register/',
        '/signup',
        '/signup/',
    ]
    if (ignored_paths.includes(req.path)) {
        next()
        return
    }
    if (!req.headers.authorization || req.headers.authorization.slice(0, 6).toLowerCase() !== "token ") {
        res.status(403).send({message: "Token not found"})
        return
    }
    const token = req.headers.authorization.slice(6)
    const tokenObj = await Token.findOne({token: token})
    if (!tokenObj) {
        res.status(403).send({message: "Invalid token"})
        return
    }
    req.token = tokenObj
    next()
}

module.exports = {
    validateToken,
}