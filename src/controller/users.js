const knex = require("../config/connect")
const bcrypt = require("bcrypt")
const { userSchema } = require("../schemas/userSchema")

const createUser = async (req, res) => {
    let {nome, email, senha} = req.body
    
    try {
        await userSchema.validate(req.body)

        const checkEmail = await knex('usuarios').where("email", "=", email).first()

        if(checkEmail) {
            return res.status(400).json({message: "Email already exists"})
        }

        const passwordCrypt = await bcrypt.hash(senha, 10)
        
        const newUser = await knex('usuarios').insert({
            nome,
            email,
            senha: passwordCrypt
        }).returning("*")

        if (newUser.length === 0) {
            return res.status(400).json({message: "User did not create"})
        }

        return res.status(201).json(newUser)

    } catch (error) {
        
    }
}

module.exports = {
    createUser,

}