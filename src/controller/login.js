const knex = require("../config/connect")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const loginSchema = require("../schemas/loginSchema")
const jwtPassword = process.env.JWT_PASSWORD

const login = async (req, res) => {
    const {email, senha} = req.body

    try {
        await loginSchema.validate(req.body)

        const userCheck = await knex('usuarios').where({email}).returning("*")

        if(!userCheck[0]) {
            return res.status(404).json({message: "User not found"})
        }

        const passwordCheck = await bcrypt.compare(senha, userCheck[0].senha)

        if(!passwordCheck) {
            return res.status(400).json({message: "Email or password invalid"})
        }

        const token = jwt.sign({
            id: userCheck[0].id,
            nome: userCheck[0].nome,
            email: userCheck[0].email
            }, 
            jwtPassword, 
            {expiresIn: "8h"})
        
        const {senha: _, ...userLogged} = userCheck[0]

        return res.json({
            usuario: userLogged,
            token
        })

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

module.exports = login