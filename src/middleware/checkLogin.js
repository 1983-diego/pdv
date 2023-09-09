const knex = require("../config/connect")
const jwt = require("jsonwebtoken")
const jwtPassword = process.env.JWT_PASSWORD

const checkLogin = async (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization) {
        res.status(401).json({message: "Token not valid"})
    }

    let token = authorization.split(" ")[1].trim()

    try {
        const {id} = jwt.verify(token, jwtPassword)

        const user = await knex("usuarios").where({id}).returning("*")

        if (!user[0]) {
            return res.status(401).json({message: "User not authorized"})
        }

        const {senha:_, ...userChecked} = user[0]

        req.user = userChecked
        next()
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

module.exports = checkLogin